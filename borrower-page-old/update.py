import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

docs = [
    ('pan', 'PAN Card'),
    ('aadhaar', 'Aadhaar Card'),
    ('salary', 'Salary Slips'),
    ('bank', 'Bank Statement')
]

for doc_id, display_name in docs:
    pattern = r'(<div class="premium-doc-card" id="card-' + doc_id + r'">.*?<div class="doc-card-body">).*?(?=</div>\s*</div>\s*(?:<!--|<div class="premium-doc-card|<div class="submit-actions))'
    
    def repl(m, d_id=doc_id, d_name=display_name):
        return m.group(1) + '''
                                                    <p class="doc-desc" style="margin-bottom:8px;font-size:13px;color:var(--text-muted);">Upload a clear copy of your ''' + d_name + '''.</p>
                                                    <div class="upload-zone-compact" id="upload-zone-''' + d_id + '''" style="margin-top:12px;">
                                                        <input type="file" id="input-''' + d_id + '''" accept=".pdf,.jpg,.jpeg,.png" class="hidden-file-input" style="display:none;">
                                                        <button type="button" class="btn btn-outline btn-upload-compact" onclick="document.getElementById('input-''' + d_id + '''').click()" style="width:100%;padding:10px;font-weight:600;color:var(--primary-blue);border:1px solid var(--primary-blue);border-radius:6px;background:transparent;cursor:pointer;">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;vertical-align:middle;">
                                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                                <polyline points="17 8 12 3 7 8" />
                                                                <line x1="12" y1="3" x2="12" y2="15" />
                                                            </svg> Upload ''' + d_name + '''
                                                        </button>
                                                        <div class="upload-hint" style="font-size:11px;color:var(--text-muted);margin-top:6px;text-align:center;">PDF, JPG, JPEG, PNG &bull; Max 10 MB</div>
                                                        <div class="upload-error hidden" id="error-''' + d_id + '''" style="display:none;color:#DC2626;font-size:12px;margin-top:8px;"></div>
                                                        <div class="upload-progress hidden" id="progress-''' + d_id + '''" style="display:none;margin-top:8px;">
                                                            <div class="progress-bar-track" style="height:4px;background:#E2E8F0;border-radius:2px;">
                                                                <div class="progress-bar-fill" style="width:0%;height:100%;background:var(--primary-blue);"></div>
                                                            </div>
                                                            <span class="progress-text" style="font-size:11px;color:var(--text-muted);">Uploading...</span>
                                                        </div>
                                                    </div>

                                                    <div class="doc-preview-card hidden" id="preview-''' + d_id + '''" style="display:none;">
                                                        <div class="preview-info-compact" style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                                                            <div class="file-type-icon" style="font-size:24px;background:#F1F5F9;padding:6px 12px;border-radius:8px;">📄</div>
                                                            <div class="file-details" style="display:flex;flex-direction:column;">
                                                                <span class="file-name" id="file-name-''' + d_id + '''" style="font-size:13px;font-weight:600;color:var(--text-heading);">file.pdf</span>
                                                                <span class="file-meta" id="file-meta-''' + d_id + '''" style="font-size:11px;color:var(--text-muted);">2.1 MB</span>
                                                            </div>
                                                        </div>
                                                        <div class="preview-actions-inline" style="display:flex;gap:8px;">
                                                            <button class="action-btn-inline view-btn" style="flex:1;padding:6px;font-size:12px;font-weight:600;border:none;border-radius:4px;cursor:pointer;background:#EFF6FF;color:var(--primary-blue);">👁 View</button>
                                                            <button class="action-btn-inline replace-btn" onclick="document.getElementById('input-''' + d_id + '''').click()" style="flex:1;padding:6px;font-size:12px;font-weight:600;border:none;border-radius:4px;cursor:pointer;background:#F1F5F9;color:var(--text-body);">🔄 Replace</button>
                                                            <button class="action-btn-inline delete-btn" onclick="deleteDocument('''' + d_id + '''')" style="flex:1;padding:6px;font-size:12px;font-weight:600;border:none;border-radius:4px;cursor:pointer;background:#FEF2F2;color:#DC2626;">🗑 Delete</button>
                                                        </div>
                                                    </div>
'''
    html = re.sub(pattern, repl, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Done!')
