package controller

import (
	"errors"
	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/service"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type supportTicketRequest struct {
	Subject  string `json:"subject"`
	Category string `json:"category"`
	Content  string `json:"content"`
}

func supportPage(c *gin.Context) (int, int, bool) {
	p, _ := strconv.Atoi(c.DefaultQuery("p", "1"))
	s, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if p < 1 || s < 1 || s > 100 {
		common.ApiErrorMsg(c, "invalid pagination")
		return 0, 0, false
	}
	return p, s, true
}
func supportTicketID(c *gin.Context) (int, bool) {
	id, e := strconv.Atoi(c.Param("id"))
	if e != nil || id < 1 {
		common.ApiErrorMsg(c, "invalid ticket id")
		return 0, false
	}
	return id, true
}
func CreateSupportTicket(c *gin.Context) {
	var r supportTicketRequest
	if e := common.DecodeJson(c.Request.Body, &r); e != nil {
		common.ApiErrorMsg(c, "invalid ticket content")
		return
	}
	t, e := service.CreateSupportTicket(c.GetInt("id"), service.SupportTicketInput{Subject: r.Subject, Category: r.Category, Content: r.Content})
	if errors.Is(e, service.ErrInvalidSupportTicket) {
		common.ApiErrorMsg(c, "invalid ticket content")
		return
	}
	if e != nil {
		common.ApiError(c, e)
		return
	}
	common.ApiSuccess(c, t)
}
func ListMySupportTickets(c *gin.Context) {
	p, s, ok := supportPage(c)
	if !ok {
		return
	}
	ts, n, e := service.ListSupportTickets(c.GetInt("id"), p, s, false, c.Query("status"), c.Query("category"), "")
	if errors.Is(e, service.ErrInvalidSupportTicket) {
		common.ApiErrorMsg(c, "invalid ticket filter")
		return
	}
	if e != nil {
		common.ApiError(c, e)
		return
	}
	common.ApiSuccess(c, gin.H{"items": ts, "total": n, "page": p, "page_size": s})
}
func GetMySupportTicket(c *gin.Context)    { getSupportTicket(c, false) }
func GetAdminSupportTicket(c *gin.Context) { getSupportTicket(c, true) }
func getSupportTicket(c *gin.Context, admin bool) {
	id, ok := supportTicketID(c)
	if !ok {
		return
	}
	detail, e := service.GetSupportTicket(id, c.GetInt("id"), admin)
	if e != nil {
		if errors.Is(e, service.ErrSupportTicketNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "ticket not found"})
			return
		}
		common.ApiError(c, e)
		return
	}
	common.ApiSuccess(c, detail)
}
func ReplyMySupportTicket(c *gin.Context)    { replySupportTicket(c, false) }
func ReplyAdminSupportTicket(c *gin.Context) { replySupportTicket(c, true) }
func replySupportTicket(c *gin.Context, admin bool) {
	id, ok := supportTicketID(c)
	if !ok {
		return
	}
	var r supportTicketRequest
	if e := common.DecodeJson(c.Request.Body, &r); e != nil {
		common.ApiErrorMsg(c, "invalid ticket content")
		return
	}
	e := service.ReplyToSupportTicket(id, c.GetInt("id"), admin, r.Content)
	if errors.Is(e, service.ErrInvalidSupportTicket) {
		common.ApiErrorMsg(c, "invalid ticket content")
		return
	}
	if errors.Is(e, service.ErrSupportTicketNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "ticket not found"})
		return
	}
	if e != nil {
		common.ApiError(c, e)
		return
	}
	common.ApiSuccess(c, nil)
}
func ChangeMySupportTicketState(c *gin.Context)    { changeSupportTicketState(c, false) }
func ChangeAdminSupportTicketState(c *gin.Context) { changeSupportTicketState(c, true) }
func changeSupportTicketState(c *gin.Context, admin bool) {
	id, ok := supportTicketID(c)
	if !ok {
		return
	}
	var r struct {
		Status string `json:"status"`
	}
	if e := common.DecodeJson(c.Request.Body, &r); e != nil {
		common.ApiErrorMsg(c, "invalid ticket status")
		return
	}
	e := service.ChangeSupportTicketState(id, c.GetInt("id"), admin, r.Status)
	if errors.Is(e, service.ErrInvalidSupportTicketState) {
		common.ApiErrorMsg(c, "invalid ticket status")
		return
	}
	if errors.Is(e, service.ErrSupportTicketNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "ticket not found"})
		return
	}
	if e != nil {
		common.ApiError(c, e)
		return
	}
	common.ApiSuccess(c, nil)
}
func ListAdminSupportTickets(c *gin.Context) {
	p, s, ok := supportPage(c)
	if !ok {
		return
	}
	ts, n, e := service.ListSupportTickets(0, p, s, true, c.Query("status"), c.Query("category"), c.Query("keyword"))
	if errors.Is(e, service.ErrInvalidSupportTicket) {
		common.ApiErrorMsg(c, "invalid ticket filter")
		return
	}
	if e != nil {
		common.ApiError(c, e)
		return
	}
	common.ApiSuccess(c, gin.H{"items": ts, "total": n, "page": p, "page_size": s})
}
