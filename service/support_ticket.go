package service

import (
	"errors"
	"strings"
	"time"

	"github.com/QuantumNous/new-api/model"
	"gorm.io/gorm"
)

var ErrSupportTicketNotFound = errors.New("support ticket not found")
var ErrInvalidSupportTicket = errors.New("invalid support ticket")
var ErrInvalidSupportTicketState = errors.New("invalid support ticket state")

type SupportTicketInput struct {
	Subject  string
	Category string
	Content  string
}

type SupportTicketDetail struct {
	Ticket   *model.SupportTicket         `json:"ticket"`
	Messages []model.SupportTicketMessage `json:"messages"`
}

func CreateSupportTicket(userId int, input SupportTicketInput) (*model.SupportTicket, error) {
	if !validSupportTicketInput(input, true) {
		return nil, ErrInvalidSupportTicket
	}
	now := time.Now()
	ticket := &model.SupportTicket{
		UserId:         userId,
		Subject:        strings.TrimSpace(input.Subject),
		Category:       input.Category,
		Status:         model.SupportTicketPendingAdmin,
		LastUserReadAt: &now,
	}
	message := &model.SupportTicketMessage{
		AuthorId:   userId,
		AuthorRole: "user",
		Content:    strings.TrimSpace(input.Content),
	}
	if err := model.CreateSupportTicket(ticket, message); err != nil {
		return nil, err
	}
	return ticket, nil
}

func ListSupportTickets(userId, page, pageSize int, admin bool, status, category, keyword string) ([]model.SupportTicket, int64, error) {
	if (status != "" && !model.IsValidSupportStatus(status)) || (category != "" && !model.IsValidSupportCategory(category)) {
		return nil, 0, ErrInvalidSupportTicket
	}
	return model.ListSupportTickets(userId, page, pageSize, admin, status, category, keyword)
}

func GetSupportTicket(ticketId, userId int, admin bool) (*SupportTicketDetail, error) {
	ticket, err := model.FindSupportTicket(ticketId, userId, admin)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, ErrSupportTicketNotFound
	}
	if err != nil {
		return nil, err
	}
	messages, err := model.ListSupportTicketMessages(ticketId)
	if err != nil {
		return nil, err
	}
	if err = model.MarkSupportTicketRead(ticket, admin, time.Now()); err != nil {
		return nil, err
	}
	return &SupportTicketDetail{Ticket: ticket, Messages: messages}, nil
}

func ReplyToSupportTicket(ticketId, userId int, admin bool, content string) error {
	input := SupportTicketInput{Content: content}
	if !validSupportTicketInput(input, false) {
		return ErrInvalidSupportTicket
	}
	ticket, err := model.FindSupportTicket(ticketId, userId, admin)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return ErrSupportTicketNotFound
	}
	if err != nil {
		return err
	}
	role, status, readField := "user", model.SupportTicketPendingAdmin, "last_user_read_at"
	if admin {
		role, status, readField = "admin", model.SupportTicketPendingUser, "last_admin_read_at"
	}
	return model.ReplyToSupportTicket(ticket, &model.SupportTicketMessage{
		TicketId:   ticketId,
		AuthorId:   userId,
		AuthorRole: role,
		Content:    strings.TrimSpace(content),
	}, status, readField, time.Now())
}

func ChangeSupportTicketState(ticketId, userId int, admin bool, requestedStatus string) error {
	if requestedStatus != model.SupportTicketClosed && requestedStatus != model.SupportTicketPendingAdmin && requestedStatus != model.SupportTicketPendingUser {
		return ErrInvalidSupportTicketState
	}
	expectedOpenStatus := model.SupportTicketPendingAdmin
	if admin {
		expectedOpenStatus = model.SupportTicketPendingUser
	}
	if requestedStatus != model.SupportTicketClosed && requestedStatus != expectedOpenStatus {
		return ErrInvalidSupportTicketState
	}
	ticket, err := model.FindSupportTicket(ticketId, userId, admin)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return ErrSupportTicketNotFound
	}
	if err != nil {
		return err
	}
	return model.ChangeSupportTicketState(ticket, requestedStatus, time.Now())
}

func validSupportTicketInput(input SupportTicketInput, creating bool) bool {
	content := strings.TrimSpace(input.Content)
	if content == "" || len(content) > 10000 {
		return false
	}
	if !creating {
		return true
	}
	return strings.TrimSpace(input.Subject) != "" && len(input.Subject) <= 160 && model.IsValidSupportCategory(input.Category)
}
