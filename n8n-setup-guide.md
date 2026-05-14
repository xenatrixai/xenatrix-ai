# n8n Connection Setup Guide

## Current Configuration ✅

### Webhook URL
- **Environment File**: `https://n8n-production-7a00b.up.railway.app/webhook/rynex-demo`
- **JavaScript Code**: Updated to match the correct URL
- **Status**: ✅ Fixed - URLs now synchronized

### Integration Points
1. **Terminal Demo Form** (index.html)
   - Collects: name, business, industry, phone, email
   - Sends to n8n webhook on submission
   - Shows success/error feedback

2. **JavaScript Handler** (assets/js/main.js)
   - Validates input fields
   - Constructs payload with timestamp and source
   - Handles success/error responses
   - Enhanced console logging for real-time debugging
   - Uses optimized `fetch` for terminal and `sendBeacon` for contact form lead sync

### Payload Structure
```json
{
  "name": "User Name",
  "business": "Business Name", 
  "industry": "Industry Type",
  "phone": "1234567890",
  "email": "user@example.com",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "source": "portfolio_terminal_demo"
}
```

## Testing Options

### 1. Manual Testing
- Open `test-n8n.html` in browser
- Click "Test n8n Webhook" button
- Check console for detailed logs

### 2. Terminal Demo Testing
- Open main portfolio site
- Click "Experience Automation Live" buttons
- Fill form and submit
- Monitor browser console (F12) for:
  - "Sending to n8n webhook:" 
  - "Payload:" 
  - "Response status:"
  - "Success response:" or error details

## n8n Workflow Requirements

### Expected Workflow Structure
1. **Webhook Trigger**: `/webhook/rynex-demo`
2. **Data Processing**: Extract form fields
3. **Actions** (as shown in terminal success):
   - ✅ WhatsApp message queuing
   - ✅ Google Sheets logging  
   - ✅ Pipeline completion response

### Response Format
n8n should return JSON response (optional but recommended):
```json
{
  "success": true,
  "message": "Workflow completed successfully"
}
```

## Troubleshooting

### Common Issues
1. **CORS Errors**: n8n webhook must allow cross-origin requests
2. **Timeout**: Workflow should complete within 30 seconds
3. **Invalid Response**: Ensure n8n returns proper HTTP status codes

### Debug Steps
1. Open browser DevTools (F12)
2. Check Network tab for webhook request
3. Review Console tab for JavaScript logs
4. Verify n8n workflow execution logs

## Security Notes
- Webhook URL is publicly accessible
- Consider adding authentication if needed
- Validate input data in n8n workflow
- Rate limiting may be necessary for production
