# Ollama Integration Setup Guide
## 🔑 Environment Setup

### Required Environment Variables

Add your Ollama API key to `server/.env`:

```env
# Ollama Configuration
OLLAMA_API_KEY=your_actual_ollama_api_key_here
OLLAMA_HOST=https://ollama.com
OLLAMA_MODEL=gpt-oss:20b
```

**Important:** Replace `your_actual_ollama_api_key_here` with your real Ollama API key!

## 🚀 How to Start

### 1. Install Dependencies (Already Done)

```powershell
cd d:\grieve_ease_etp\grive_ease\server
npm install
```

### 2. Update Your API Key

Edit `server/.env` and paste your Ollama API key in the `OLLAMA_API_KEY` field.

### 3. Start the Server

```powershell
cd d:\grieve_ease_etp\grive_ease\server
npm run dev
```

You should see:

```
RAG: using OllamaRAGService with model gpt-oss:20b
Server is listening on port 8080
MongoDB connected successfully
```

## 🧪 Testing the API

### Test 1: Health Check

```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/ask-ai-rag/health -Method Get
```

Expected: `{ "ok": true }`

### Test 2: Ask About a Complaint

```powershell
$body = @{
    question = "The computer lab has been closed for 3 days and 25 students couldn't complete their practicals. Is this a valid complaint?"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8080/api/ask-ai-rag/query -Method Post -ContentType 'application/json' -Body $body
```

Expected response with:

- Answer explaining if it's a valid complaint
- `is_issue: yes` with reasoning
- `key_points` about the issue
- `suggested_category: facility` or `academic`
- `suggested_severity: medium` or `high`
- `next_steps` for the student

### Test 3: Upload a Document and Query

```powershell
# Create a test file
"College Policy: Students have the right to access lab facilities during working hours. Any closure must be notified 48 hours in advance." | Out-File -FilePath test_policy.txt

# Upload the document
$form = @{
    files = Get-Item -Path test_policy.txt
}
Invoke-RestMethod -Uri http://localhost:8080/api/ask-ai-rag/upload -Method Post -Form $form

# Query with context
$body = @{
    question = "The lab was closed without notice. Can I complain?"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8080/api/ask-ai-rag/query -Method Post -ContentType 'application/json' -Body $body
```

## 🎯 Complaint Validation Features

The Ollama integration is specifically configured to:

1. **Validate Complaints** - Determines if an issue is a legitimate complaint
2. **Categorize Issues** - Suggests: academic, facility, harassment, finance, admin, or other
3. **Assess Severity** - Rates as low, medium, or high
4. **Provide Guidance** - Offers 3-5 key points and 2-3 next steps
5. **Use Context** - Leverages uploaded documents (policies, guidelines) when answering

## 🔧 Model Configuration

**Default Model:** `gpt-oss:20b`

- Good balance of quality and speed
- Suitable for complaint analysis and validation

**To Change Model:** Edit `OLLAMA_MODEL` in `.env`

Available models (check Ollama docs for latest):

- `gpt-oss:20b` - Recommended
- `gpt-oss:7b` - Faster, lighter
- Other Ollama-compatible models

## 📋 How It Works

1. **User asks a question** via the Ask AI feature in the dashboard
2. **File upload (optional)** - User can upload policies, guidelines, etc.
3. **RAG retrieval** - System finds relevant context from uploaded docs
4. **Ollama processing** - Sends question + context to Ollama `gpt-oss:20b`
5. **Structured response** - Returns analysis with:
   - Clear answer
   - Validity assessment (is_issue)
   - Key points
   - Category & severity
   - Next steps

## ⚠️ Important Notes


Just get an API key from https://ollama.com and use it!

### Embedding Fallback

The current implementation uses a simple hash-based embedding for vector similarity. This works for basic RAG but for production you may want to:

- Use a dedicated embedding model (like `nomic-embed-text`)
- Or use Ollama's embedding endpoint if available

## 🐛 Troubleshooting

### Error: "Ollama API error"

- Check your `OLLAMA_API_KEY` is correct in `.env`
- Verify the key has not expired
- Ensure `OLLAMA_HOST` is set to `https://ollama.com`

### Error: "Cannot find module 'ollama'"

```powershell
cd d:\grieve_ease_etp\grive_ease\server
npm install ollama --save
```

### Server won't start

- Check MongoDB is running
- Verify all environment variables in `.env`
- Check for port conflicts on 8080

## 📱 Frontend Integration


Features available:

- Type questions directly
- Upload files (PDF, DOCX, TXT)
- See context snippets from uploaded documents
- Get structured complaint validation

## 🎓 Example Use Cases

### Use Case 1: Simple Complaint Check

**Student asks:** "My professor hasn't returned assignments for 2 months. Should I complain?"

**Ollama responds with:**

- is_issue: yes - This affects your academic progress
- category: academic
- severity: medium
- next_steps: Document dates, speak to department head, file formal complaint

### Use Case 2: With Context

**Student uploads:** College handbook PDF
**Student asks:** "Can I get a hostel room change due to noise issues?"

**Ollama responds with:**

- Checks handbook policy on room changes
- is_issue: yes (if policy supports it)
- category: facility
- severity: low-medium
- next_steps: Fill room change form, meet warden, provide evidence

## ✨ Next Steps

1. **Add your Ollama API key** to `server/.env`
2. **Restart the server**: `npm run dev`
3. **Test the endpoints** using the PowerShell commands above
4. **Try the frontend** - Open the Ask AI feature in your dashboard
5. **Upload some test documents** - College policies, guidelines, etc.
6. **Ask complaint-related questions** and see the validation in action!

---


