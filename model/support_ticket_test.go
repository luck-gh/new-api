package model

import (
	"testing"
	"time"

	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestListSupportTicketsScopesAndFiltersTickets(t *testing.T) {
	previous := DB
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	require.NoError(t, err)
	DB = db
	t.Cleanup(func() { DB = previous })
	require.NoError(t, db.AutoMigrate(&User{}, &SupportTicket{}))
	now := time.Now()
	first := SupportTicket{UserId: 1, Subject: "Billing question", Category: "billing", Status: SupportTicketPendingAdmin, UpdatedAt: now}
	second := SupportTicket{UserId: 2, Subject: "API error", Category: "api", Status: SupportTicketPendingUser, UpdatedAt: now.Add(time.Second)}
	require.NoError(t, db.Create(&User{Id: 1, Username: "billing-user", Password: "password", AffCode: "billing-aff"}).Error)
	require.NoError(t, db.Create(&User{Id: 2, Username: "api-user", Password: "password", AffCode: "api-aff"}).Error)
	require.NoError(t, db.Create(&first).Error)
	require.NoError(t, db.Create(&second).Error)

	items, total, err := ListSupportTickets(1, 1, 20, false, "", "", "")
	require.NoError(t, err)
	require.Len(t, items, 1)
	assert.Equal(t, first.Id, items[0].Id)
	assert.Equal(t, int64(1), total)

	items, total, err = ListSupportTickets(0, 1, 20, true, SupportTicketPendingUser, "api", "error")
	require.NoError(t, err)
	require.Len(t, items, 1)
	assert.Equal(t, second.Id, items[0].Id)
	assert.Equal(t, int64(1), total)
}

func TestSupportTicketCategoryValidation(t *testing.T) {
	for _, category := range []string{"account", "billing", "api", "other"} {
		assert.True(t, IsValidSupportCategory(category))
	}
	assert.False(t, IsValidSupportCategory("unknown"))
}
