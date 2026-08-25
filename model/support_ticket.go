package model

import (
	"strings"
	"time"

	"gorm.io/gorm"
)

const (
	SupportTicketPendingAdmin = "pending_admin"
	SupportTicketPendingUser  = "pending_user"
	SupportTicketClosed       = "closed"
)

type SupportTicket struct {
	Id              int        `json:"id"`
	UserId          int        `json:"user_id" gorm:"index:idx_support_ticket_user_updated,priority:1;index"`
	Subject         string     `json:"subject" gorm:"type:varchar(160);not null"`
	Status          string     `json:"status" gorm:"type:varchar(32);not null;index:idx_support_ticket_status_updated,priority:1"`
	Category        string     `json:"category" gorm:"type:varchar(32);not null;index"`
	LastUserReadAt  *time.Time `json:"last_user_read_at"`
	LastAdminReadAt *time.Time `json:"last_admin_read_at"`
	ClosedAt        *time.Time `json:"closed_at"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at" gorm:"index:idx_support_ticket_user_updated,priority:2;index:idx_support_ticket_status_updated,priority:2"`
}
type SupportTicketMessage struct {
	Id         int       `json:"id"`
	TicketId   int       `json:"ticket_id" gorm:"index:idx_support_message_ticket_created,priority:1;index"`
	AuthorId   int       `json:"author_id" gorm:"index"`
	AuthorRole string    `json:"author_role" gorm:"type:varchar(16);not null"`
	Content    string    `json:"content" gorm:"type:text;not null"`
	CreatedAt  time.Time `json:"created_at" gorm:"index:idx_support_message_ticket_created,priority:2"`
}

func IsValidSupportCategory(category string) bool {
	return category == "account" || category == "billing" || category == "api" || category == "other"
}

func IsValidSupportStatus(status string) bool {
	return status == SupportTicketPendingAdmin || status == SupportTicketPendingUser || status == SupportTicketClosed
}

func CreateSupportTicket(ticket *SupportTicket, message *SupportTicketMessage) error {
	return DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(ticket).Error; err != nil {
			return err
		}
		message.TicketId = ticket.Id
		return tx.Create(message).Error
	})
}

func FindSupportTicket(ticketId, userId int, admin bool) (*SupportTicket, error) {
	query := DB
	if !admin {
		query = query.Where("user_id = ?", userId)
	}
	var ticket SupportTicket
	if err := query.First(&ticket, ticketId).Error; err != nil {
		return nil, err
	}
	return &ticket, nil
}

func ListSupportTicketMessages(ticketId int) ([]SupportTicketMessage, error) {
	var messages []SupportTicketMessage
	err := DB.Where("ticket_id = ?", ticketId).Order("created_at asc").Order("id asc").Find(&messages).Error
	return messages, err
}

func MarkSupportTicketRead(ticket *SupportTicket, admin bool, now time.Time) error {
	field := "last_user_read_at"
	if admin {
		field = "last_admin_read_at"
	}
	if err := DB.Model(ticket).Update(field, &now).Error; err != nil {
		return err
	}
	if admin {
		ticket.LastAdminReadAt = &now
	} else {
		ticket.LastUserReadAt = &now
	}
	return nil
}

func ReplyToSupportTicket(ticket *SupportTicket, message *SupportTicketMessage, status string, readField string, now time.Time) error {
	return DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(message).Error; err != nil {
			return err
		}
		return tx.Model(ticket).Updates(map[string]interface{}{
			"status":    status,
			"closed_at": nil,
			readField:   &now,
		}).Error
	})
}

func ChangeSupportTicketState(ticket *SupportTicket, status string, now time.Time) error {
	updates := map[string]interface{}{"status": status}
	if status == SupportTicketClosed {
		updates["closed_at"] = &now
	} else {
		updates["closed_at"] = nil
	}
	return DB.Model(ticket).Updates(updates).Error
}

func ListSupportTickets(userId, page, pageSize int, admin bool, status, category, keyword string) ([]SupportTicket, int64, error) {
	q := DB.Model(&SupportTicket{})
	if !admin {
		q = q.Where("support_tickets.user_id = ?", userId)
	}
	if status != "" && IsValidSupportStatus(status) {
		q = q.Where("support_tickets.status = ?", status)
	}
	if category != "" && IsValidSupportCategory(category) {
		q = q.Where("support_tickets.category = ?", category)
	}
	if keyword = strings.TrimSpace(keyword); keyword != "" {
		pattern := "%" + keyword + "%"
		if admin {
			q = q.Joins("LEFT JOIN users ON users.id = support_tickets.user_id").Where("support_tickets.subject LIKE ? OR users.username LIKE ? OR users.display_name LIKE ?", pattern, pattern, pattern)
		} else {
			q = q.Where("support_tickets.subject LIKE ?", pattern)
		}
	}
	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	var tickets []SupportTicket
	err := q.Order("support_tickets.updated_at desc").Order("support_tickets.id desc").Offset((page - 1) * pageSize).Limit(pageSize).Find(&tickets).Error
	return tickets, total, err
}
