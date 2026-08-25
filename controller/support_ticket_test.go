package controller

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func setupSupportTicketControllerTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	gin.SetMode(gin.TestMode)
	previousDB := model.DB
	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	require.NoError(t, err)
	require.NoError(t, db.AutoMigrate(&model.User{}, &model.SupportTicket{}, &model.SupportTicketMessage{}))
	model.DB = db
	t.Cleanup(func() {
		model.DB = previousDB
		sqlDB, sqlErr := db.DB()
		if sqlErr == nil {
			_ = sqlDB.Close()
		}
	})
	return db
}

func supportTicketContext(t *testing.T, method, target string, userID int, payload interface{}) (*gin.Context, *httptest.ResponseRecorder) {
	t.Helper()
	recorder := httptest.NewRecorder()
	context, _ := gin.CreateTestContext(recorder)
	var body *strings.Reader
	if payload == nil {
		body = strings.NewReader("")
	} else {
		encoded, err := common.Marshal(payload)
		require.NoError(t, err)
		body = strings.NewReader(string(encoded))
	}
	context.Request = httptest.NewRequest(method, target, body)
	context.Set("id", userID)
	return context, recorder
}

func createSupportTicketFixture(t *testing.T, db *gorm.DB, userID int, subject string, createdAt time.Time) model.SupportTicket {
	t.Helper()
	ticket := model.SupportTicket{UserId: userID, Subject: subject, Category: "api", Status: model.SupportTicketPendingAdmin, CreatedAt: createdAt, UpdatedAt: createdAt}
	require.NoError(t, db.Create(&ticket).Error)
	require.NoError(t, db.Create(&model.SupportTicketMessage{TicketId: ticket.Id, AuthorId: userID, AuthorRole: "user", Content: "first", CreatedAt: createdAt}).Error)
	return ticket
}

func TestSupportTicketUserIsolationAndReadMarker(t *testing.T) {
	db := setupSupportTicketControllerTestDB(t)
	ticket := createSupportTicketFixture(t, db, 12, "Private issue", time.Now().Add(-time.Minute))

	ownerContext, ownerRecorder := supportTicketContext(t, http.MethodGet, fmt.Sprintf("/api/user/support/tickets/%d", ticket.Id), 12, nil)
	ownerContext.Params = gin.Params{{Key: "id", Value: fmt.Sprint(ticket.Id)}}
	GetMySupportTicket(ownerContext)
	require.Equal(t, http.StatusOK, ownerRecorder.Code)

	var reloaded model.SupportTicket
	require.NoError(t, db.First(&reloaded, ticket.Id).Error)
	require.NotNil(t, reloaded.LastUserReadAt)

	otherContext, otherRecorder := supportTicketContext(t, http.MethodGet, fmt.Sprintf("/api/user/support/tickets/%d", ticket.Id), 13, nil)
	otherContext.Params = gin.Params{{Key: "id", Value: fmt.Sprint(ticket.Id)}}
	GetMySupportTicket(otherContext)
	assert.Equal(t, http.StatusNotFound, otherRecorder.Code)
}

func TestSupportTicketRepliesAndStateTransitionsFollowRoles(t *testing.T) {
	db := setupSupportTicketControllerTestDB(t)
	ticket := createSupportTicketFixture(t, db, 21, "Need help", time.Now().Add(-time.Minute))

	userReplyContext, userReplyRecorder := supportTicketContext(t, http.MethodPost, "/api/user/support/tickets", 21, supportTicketRequest{Content: "More detail"})
	userReplyContext.Params = gin.Params{{Key: "id", Value: fmt.Sprint(ticket.Id)}}
	ReplyMySupportTicket(userReplyContext)
	require.Equal(t, http.StatusOK, userReplyRecorder.Code)

	adminReplyContext, adminReplyRecorder := supportTicketContext(t, http.MethodPost, "/api/support/admin/tickets", 1, supportTicketRequest{Content: "We are checking"})
	adminReplyContext.Params = gin.Params{{Key: "id", Value: fmt.Sprint(ticket.Id)}}
	ReplyAdminSupportTicket(adminReplyContext)
	require.Equal(t, http.StatusOK, adminReplyRecorder.Code)

	var messages []model.SupportTicketMessage
	require.NoError(t, db.Where("ticket_id = ?", ticket.Id).Order("created_at asc").Order("id asc").Find(&messages).Error)
	require.Len(t, messages, 3)
	assert.Equal(t, []string{"user", "user", "admin"}, []string{messages[0].AuthorRole, messages[1].AuthorRole, messages[2].AuthorRole})

	invalidReopenContext, invalidReopenRecorder := supportTicketContext(t, http.MethodPut, "/api/user/support/tickets", 21, map[string]string{"status": model.SupportTicketPendingUser})
	invalidReopenContext.Params = gin.Params{{Key: "id", Value: fmt.Sprint(ticket.Id)}}
	ChangeMySupportTicketState(invalidReopenContext)
	assert.Equal(t, http.StatusOK, invalidReopenRecorder.Code)

	closeContext, closeRecorder := supportTicketContext(t, http.MethodPut, "/api/user/support/tickets", 21, map[string]string{"status": model.SupportTicketClosed})
	closeContext.Params = gin.Params{{Key: "id", Value: fmt.Sprint(ticket.Id)}}
	ChangeMySupportTicketState(closeContext)
	require.Equal(t, http.StatusOK, closeRecorder.Code)

	reopenContext, reopenRecorder := supportTicketContext(t, http.MethodPut, "/api/user/support/tickets", 21, map[string]string{"status": model.SupportTicketPendingAdmin})
	reopenContext.Params = gin.Params{{Key: "id", Value: fmt.Sprint(ticket.Id)}}
	ChangeMySupportTicketState(reopenContext)
	require.Equal(t, http.StatusOK, reopenRecorder.Code)

	var reloaded model.SupportTicket
	require.NoError(t, db.First(&reloaded, ticket.Id).Error)
	assert.Equal(t, model.SupportTicketPendingAdmin, reloaded.Status)
	assert.Nil(t, reloaded.ClosedAt)
}

func TestListAdminSupportTicketsFiltersAndPaginates(t *testing.T) {
	db := setupSupportTicketControllerTestDB(t)
	first := createSupportTicketFixture(t, db, 31, "First API issue", time.Now().Add(-2*time.Minute))
	second := createSupportTicketFixture(t, db, 32, "Second API issue", time.Now().Add(-time.Minute))
	require.NoError(t, db.Create(&model.User{Id: 31, Username: "first-user", Password: "password", AffCode: "first-aff"}).Error)
	require.NoError(t, db.Create(&model.User{Id: 32, Username: "second-user", Password: "password", AffCode: "second-aff"}).Error)
	_ = first
	require.NoError(t, db.Model(&second).Update("status", model.SupportTicketPendingUser).Error)

	context, recorder := supportTicketContext(t, http.MethodGet, "/api/support/admin/tickets?status=pending_user&category=api&keyword=second-user&page_size=1", 1, nil)
	ListAdminSupportTickets(context)
	require.Equal(t, http.StatusOK, recorder.Code)
	assert.Contains(t, recorder.Body.String(), "Second API issue")
	assert.NotContains(t, recorder.Body.String(), "First API issue")
}
