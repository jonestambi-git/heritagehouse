# Service Schedule CRUD System

## Overview
The service schedule system allows admins to create, read, update, and delete church service times. Changes are automatically reflected on the public contact page.

## Files Created

### 1. API Route
**File**: `app/api/v1/admin/service-schedule/route.ts`

Handles all CRUD operations for service schedules:
- **GET** - Fetch all service schedules
- **POST** - Create a new service schedule
- **PUT** - Update an existing service schedule
- **DELETE** - Delete a service schedule

### 2. Admin Management Page
**File**: `app/(admin)/admin/service-schedule/page.tsx`

Admin interface for managing service schedules with:
- List view of all schedules
- Add new schedule form
- Edit existing schedules
- Delete schedules with confirmation
- Real-time updates

### 3. Public Contact Page
**File**: `app/contact/page.tsx` (updated)

Now fetches service schedules from the API and displays them dynamically.

## Database Schema

Service schedules are stored in MongoDB with the following structure:

```typescript
interface ServiceSchedule {
  _id: ObjectId;
  day: string;           // e.g., "Monday"
  title: string;         // e.g., "Counseling"
  time: string;          // e.g., "08:00 AM - 05:00 PM"
  description?: string;  // Optional description
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### GET /api/v1/admin/service-schedule
Fetch all service schedules.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "day": "Monday",
      "title": "Counseling",
      "time": "08:00 AM - 05:00 PM",
      "description": "Pastoral counseling and spiritual guidance",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/v1/admin/service-schedule
Create a new service schedule.

**Request Body:**
```json
{
  "day": "Monday",
  "title": "Counseling",
  "time": "08:00 AM - 05:00 PM",
  "description": "Pastoral counseling and spiritual guidance"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "day": "Monday",
    "title": "Counseling",
    "time": "08:00 AM - 05:00 PM",
    "description": "Pastoral counseling and spiritual guidance",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### PUT /api/v1/admin/service-schedule
Update an existing service schedule.

**Request Body:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "day": "Monday",
  "title": "Counseling Session",
  "time": "08:00 AM - 06:00 PM",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "day": "Monday",
    "title": "Counseling Session",
    "time": "08:00 AM - 06:00 PM",
    "description": "Updated description",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### DELETE /api/v1/admin/service-schedule
Delete a service schedule.

**Request Body:**
```json
{
  "_id": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service schedule deleted successfully"
}
```

## Admin Interface Features

### View Schedules
- Grid layout showing all service schedules
- Displays day, title, time, and description
- Responsive design (1 column on mobile, 2 on tablet, 2 on desktop)

### Add Schedule
1. Click "+ Add Schedule" button
2. Fill in required fields:
   - Day (e.g., "Monday")
   - Title (e.g., "Counseling")
   - Time (e.g., "08:00 AM - 05:00 PM")
3. Optionally add description
4. Click "Create" to save

### Edit Schedule
1. Click "Edit" button on any schedule card
2. Modify the fields
3. Click "Update" to save changes
4. Click "Cancel" to discard changes

### Delete Schedule
1. Click "Delete" button on any schedule card
2. Confirm deletion in the popup
3. Schedule is removed immediately

## Public Display

The contact page displays service schedules in a 4-column grid:
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 4 columns

Each schedule shows:
- Day name (in primary color)
- Service title
- Time range

## Default Schedules

If no schedules exist in the database, the system uses these defaults:

```typescript
[
  {
    day: "Monday",
    title: "Counseling",
    time: "08:00 AM - 05:00 PM",
    description: "Pastoral counseling and spiritual guidance",
  },
  {
    day: "Tuesday",
    title: "Night Vigil",
    time: "10:00 PM - 06:00 AM",
    description: "Prayer and worship night",
  },
  {
    day: "Friday",
    title: "Healing & Deliverance",
    time: "08:00 AM - 05:30 PM",
    description: "Healing service and deliverance ministry",
  },
  {
    day: "Sunday",
    title: "Services",
    time: "8:00 AM & 12:30 PM",
    description: "Main worship services",
  },
]
```

## Error Handling

### Validation Errors
- Missing required fields (day, title, time) returns 400 status
- Invalid ObjectId format returns 400 status

### Not Found Errors
- Updating/deleting non-existent schedule returns 404 status

### Server Errors
- Database connection issues return 500 status
- All errors include descriptive error messages

## Performance Considerations

✅ **Optimized:**
- Schedules are fetched once on page load
- Uses MongoDB indexing for fast queries
- Minimal data transfer
- Efficient grid rendering with Framer Motion

## Future Enhancements

Potential improvements:
- Add time picker UI for easier time entry
- Add color coding for different service types
- Add recurring schedule templates
- Add email notifications for schedule changes
- Add schedule analytics/attendance tracking
- Add multiple locations support

## Testing

### Manual Testing Checklist
- [ ] Create a new schedule
- [ ] Edit an existing schedule
- [ ] Delete a schedule
- [ ] Verify changes appear on contact page
- [ ] Test on mobile, tablet, and desktop
- [ ] Test with empty database (should show defaults)
- [ ] Test error handling (invalid data, network errors)

### API Testing
```bash
# Get all schedules
curl http://localhost:3000/api/v1/admin/service-schedule

# Create schedule
curl -X POST http://localhost:3000/api/v1/admin/service-schedule \
  -H "Content-Type: application/json" \
  -d '{"day":"Monday","title":"Counseling","time":"08:00 AM - 05:00 PM"}'

# Update schedule
curl -X PUT http://localhost:3000/api/v1/admin/service-schedule \
  -H "Content-Type: application/json" \
  -d '{"_id":"...","day":"Monday","title":"Updated","time":"09:00 AM - 06:00 PM"}'

# Delete schedule
curl -X DELETE http://localhost:3000/api/v1/admin/service-schedule \
  -H "Content-Type: application/json" \
  -d '{"_id":"..."}'
```

## Troubleshooting

**Schedules not appearing on contact page?**
- Check browser console for fetch errors
- Verify MongoDB connection is working
- Check that API route is accessible

**Admin page not loading?**
- Verify you're logged in as admin
- Check that the admin route is protected
- Clear browser cache and reload

**Changes not saving?**
- Check network tab in DevTools for failed requests
- Verify MongoDB has write permissions
- Check server logs for errors

**Duplicate schedules appearing?**
- Clear browser cache
- Refresh the page
- Check MongoDB for duplicate entries
