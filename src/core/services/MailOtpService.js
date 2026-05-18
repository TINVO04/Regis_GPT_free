 import { authenticator } from 'otplib';

export class MailOtpService {
  static TMAIL_PROVIDERS = {
    'mail1h.com': {
      label: 'mail1h',
      baseUrl: 'https://mail1h.com',
      apiKey: 'bmOuEZxwcPHMYKqD7J60',
      referer: 'https://mail1h.com/',
    },
    'jpfaq.com': {
      label: 'mail1h',
      baseUrl: 'https://mail1h.com',
      apiKey: 'bmOuEZxwcPHMYKqD7J60',
      referer: 'https://mail1h.com/',
    },
    'dmoz-odp.com': {
      label: 'mail1h',
      baseUrl: 'https://mail1h.com',
      apiKey: 'bmOuEZxwcPHMYKqD7J60',
      referer: 'https://mail1h.com/',
    },
    'edumail.ovh': {
      label: 'edumail',
      baseUrl: 'https://edumail.ovh',
      apiKey: 'znh2CydDM8qQVJEmsk5i',
      referer: 'https://edumail.ovh/',
    },
    'info.edu.rs': {
      label: 'edumail',
      baseUrl: 'https://edumail.ovh',
      apiKey: 'znh2CydDM8qQVJEmsk5i',
      referer: 'https://edumail.ovh/',
    },
    'hideaz.com': {
      label: 'edumail',
      baseUrl: 'https://edumail.ovh',
      apiKey: 'znh2CydDM8qQVJEmsk5i',
      referer: 'https://edumail.ovh/',
    },
  };

  static TINYHOST_PROVIDER = {
    label: 'tinyhost',
    baseUrl: 'https://tinyhost.shop',
    referer: 'https://tinyhost.shop/',
    origin: 'https://tinyhost.shop',
    mode: 'tinyhost',
  };

  static TINYHOST_SELECTED_DOMAIN = 'tinyhost.shop';

  constructor({ logger = null, sleep = null } = {}) {
    this.logger = logger;
    this.sleep = sleep || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
    this.createdMailboxProviders = new Map();
    this.usedOtpsByEmail = new Map();
    this.usedMessageIdsByEmail = new Map();
    this.lastOtpByEmail = new Map();
  }

  log(message, level = null) {
    if (this.logger) this.logger(message, level);
  }

  normalizeTotpSecret(secret = '') {
    return `${secret || ''}`.replace(/\s+/g, '').toUpperCase();
  }

  isValidTotpSecret(secret = '') {
    const normalizedSecret = this.normalizeTotpSecret(secret);
    return normalizedSecret.length >= 16 && /^[A-Z2-7]+=*$/.test(normalizedSecret);
  }

  generateTotpCode(secret, options = {}) {
    const normalizedSecret = this.normalizeTotpSecret(secret);
    if (!this.isValidTotpSecret(normalizedSecret)) {
      this.log('❌ TOTP secret không hợp lệ hoặc thiếu Base32.', 'ERROR');
      return null;
    }

    try {
      authenticator.options = {
        ...authenticator.options,
        step: Math.max(15, Number.parseInt(options.step ?? 30, 10) || 30),
        digits: Math.max(6, Number.parseInt(options.digits ?? 6, 10) || 6),
      };
      const code = authenticator.generate(normalizedSecret);
      if (!/^\d{6}$/.test(`${code || ''}`)) throw new Error('Generated TOTP code invalid');
      this.log(`🔐 Generated local TOTP code cho secret 2FA (${String(code).length} digits).`);
      return code;
    } catch (error) {
      this.log(`❌ Không sinh được TOTP local: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async createRandomEmail(domain) {
    const requestedDomain = `${domain || ''}`.trim().toLowerCase();
    if (requestedDomain === 'tinyhost' || requestedDomain.startsWith('tinyhost:')) {
      const provider = MailOtpService.TINYHOST_PROVIDER;
      const configuredDomain = requestedDomain.startsWith('tinyhost:')
        ? requestedDomain.slice('tinyhost:'.length)
        : MailOtpService.TINYHOST_SELECTED_DOMAIN;
      const mailboxDomain = `${configuredDomain || ''}`.trim().toLowerCase();
      if (!/^[^@\s]+\.[^@\s]+$/.test(mailboxDomain)) {
        throw new Error('Tinyhost domain không hợp lệ. Hãy nhập domain Tinyhost muốn dùng trong UI.');
      }

      const randomUser = `gpt${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`.toLowerCase();
      const email = `${randomUser}@${mailboxDomain}`;
      this.createdMailboxProviders.set(email, provider);
      this.log(`📧 Tinyhost email theo domain đã chọn: ${email}`);
      return email;
    }

    const provider = MailOtpService.TMAIL_PROVIDERS[requestedDomain];
    if (!provider) return '';

    const blockedMailboxDomains = new Set(['gersmart.com']);
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'application/json, text/plain, */*',
      Referer: provider.referer,
      Origin: provider.baseUrl,
    };

    for (let attempt = 1; attempt <= 6; attempt += 1) {
      const url = `${provider.baseUrl}/api/email/random/${encodeURIComponent(provider.apiKey)}`;
      this.log(attempt === 1 ? `📧 Lấy random email từ ${provider.label}...` : `📧 ${provider.label} random lại email (${attempt}/6)...`);
      const response = await fetch(url, { headers, timeout: 20000 });
      if (!response.ok) throw new Error(`${provider.label} random email HTTP ${response.status}`);

      const rawText = await response.text();
      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = null;
      }

      const candidates = [
        rawText,
        data?.email,
        data?.mail,
        data?.data?.email,
        data?.data?.mail,
        data?.data,
        typeof data === 'string' ? data : '',
      ];
      const email = candidates
        .map((item) => `${item || ''}`.trim().toLowerCase())
        .map((item) => item.match(/[^@\s"'<>]+@[^@\s"'<>]+\.[^@\s"'<>]+/)?.[0] || '')
        .find((item) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(item));
      if (!email) throw new Error(`${provider.label} random email response không có email hợp lệ`);

      const mailboxDomain = email.split('@').pop();
      if (blockedMailboxDomains.has(mailboxDomain) && attempt < 6) {
        this.log(`⚠️ ${provider.label} random ra domain ${mailboxDomain} đang không nhận OTP OpenAI. Bỏ qua và lấy email khác...`, 'WARNING');
        continue;
      }

      this.createdMailboxProviders.set(email, provider);
      this.log(`📧 ${provider.label} random email: ${email}`);
      return email;
    }

    throw new Error(`${provider.label} random email chỉ trả domain bị chặn, không lấy được mailbox ổn định`);
  }

  normalizeEmailKey(email = '') {
    return `${email || ''}`.trim().toLowerCase();
  }

  markOtpUsed(email, otp, metadata = {}) {
    const key = this.normalizeEmailKey(email);
    const code = `${otp || ''}`.trim();
    if (!key || !/^\d{6}$/.test(code)) return;
    if (!this.usedOtpsByEmail.has(key)) this.usedOtpsByEmail.set(key, new Set());
    this.usedOtpsByEmail.get(key).add(code);
    this.lastOtpByEmail.set(key, code);
    const messageId = `${metadata.messageId || ''}`.trim();
    if (messageId) {
      if (!this.usedMessageIdsByEmail.has(key)) this.usedMessageIdsByEmail.set(key, new Set());
      this.usedMessageIdsByEmail.get(key).add(messageId);
    }
  }

  getUsedOtps(email) {
    return [...(this.usedOtpsByEmail.get(this.normalizeEmailKey(email)) || new Set())];
  }

  getLastOtp(email) {
    return this.lastOtpByEmail.get(this.normalizeEmailKey(email)) || '';
  }

  getUsedMessageIds(email) {
    return [...(this.usedMessageIdsByEmail.get(this.normalizeEmailKey(email)) || new Set())];
  }

  async getVerificationCode(email, maxRetries = 20, delay = 5, shouldStop = () => false, options = {}) {
    const normalizedEmail = this.normalizeEmailKey(email);
    const domain = normalizedEmail.includes('@') ? normalizedEmail.split('@').pop() : '';
    const provider = this.createdMailboxProviders.get(normalizedEmail) || MailOtpService.TMAIL_PROVIDERS[domain] || {
      label: 'otpmail',
      url: `https://api.otpmail.online/api/${normalizedEmail}?html=true`,
      referer: 'https://otpmail.online/',
      origin: 'https://otpmail.online',
    };
    const rejectOtp = `${options.rejectOtp || ''}`.trim();
    const excludeOtps = new Set([
      ...this.getUsedOtps(normalizedEmail),
      ...[].concat(options.excludeOtps || []).map((item) => `${item || ''}`.trim()).filter(Boolean),
      rejectOtp,
    ].filter(Boolean));
    const excludeMessageIds = new Set([
      ...this.getUsedMessageIds(normalizedEmail),
      ...[].concat(options.excludeMessageIds || []).map((item) => `${item || ''}`.trim()).filter(Boolean),
    ]);
    const sinceMs = Math.max(0, Number(options.sinceMs || 0));
    const maxOtpAgeSeconds = Math.max(0, Number(options.maxOtpAgeSeconds || 0));
    const onRetry = typeof options.onRetry === 'function' ? options.onRetry : null;

    const normalizeMailText = (value) => `${value || ''}`
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();

    const extractOtpFromText = (value) => {
      const text = normalizeMailText(value);
      const patterns = [
        /temporary\s+chatgpt\s+verification\s+code[\s\S]{0,120}?continue[:\s]+(\d{6})/i,
        /verification\s+code[^\d]{0,80}(\d{6})/i,
        /continue[:\s]+(\d{6})/i,
        /code(?:\s+is|\s*:|\s*-)?\s*(\d{6})/i,
        /(\d{6})\s+is\s+your/i,
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match?.[1]) return `${match[1]}`.trim();
      }
      const match = text.match(/\b\d{6}\b/);
      return match ? match[0] : '';
    };

    const parseTimestampMs = (message) => {
      const normalizeDateString = (value, timezone = '') => {
        if (!value) return '';
        let text = `${value}`.trim().replace(' ', 'T');
        text = text.replace(/\.(\d{3})\d+/, '.$1');
        const zone = `${timezone || ''}`.trim();
        if (zone && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(text)) text += zone;
        return text;
      };

      const candidates = [
        [message?.timestamp?.date, message?.timestamp?.timezone],
        [message?.timestamp, ''],
        [message?.date, ''],
        [message?.created_at, ''],
        [message?.createdAt, ''],
        [message?.time, ''],
      ];
      for (const [value, timezone] of candidates) {
        if (!value) continue;
        if (typeof value === 'number') return value > 1000000000000 ? value : value * 1000;
        const parsed = Date.parse(normalizeDateString(value, timezone));
        if (Number.isFinite(parsed)) return parsed;
      }
      return 0;
    };

    const normalizeMessages = (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.messages)) return data.messages;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.mails)) return data.mails;
      if (data?.mail) return [data.mail];
      if (data && typeof data === 'object') return [data];
      return [];
    };

    const collectCandidates = (data) => {
      const directOtp = `${data?.otp || data?.code || ''}`.trim();
      const directCandidates = /^\d{6}$/.test(directOtp)
        ? [{ otp: directOtp, messageId: '', timestampMs: 0, subject: 'direct', providerLabel: provider.label, rawIndex: -1 }]
        : [];
      const messageCandidates = normalizeMessages(data)
        .map((message, rawIndex) => {
          const searchText = [
            message?.subject,
            message?.content,
            message?.html,
            message?.html_body,
            message?.body,
            message?.message,
            message?.text,
          ].filter(Boolean).join(' ');
          const otp = extractOtpFromText(searchText || JSON.stringify(message || {}));
          if (!/^\d{6}$/.test(otp)) return null;
          return {
            otp,
            messageId: `${message?.id || message?.message_id || message?.uid || ''}`.trim(),
            timestampMs: parseTimestampMs(message),
            subject: `${message?.subject || ''}`.trim(),
            providerLabel: provider.label,
            rawIndex,
          };
        })
        .filter(Boolean);
      return [...directCandidates, ...messageCandidates]
        .sort((a, b) => (b.timestampMs - a.timestampMs) || (Number(b.messageId) - Number(a.messageId)) || (a.rawIndex - b.rawIndex));
    };

    const selectFreshCandidate = (candidates) => {
      const now = Date.now();
      let skippedOldOtp = '';
      for (const candidate of candidates) {
        if (excludeOtps.has(candidate.otp)) {
          skippedOldOtp = candidate.otp;
          continue;
        }
        if (candidate.messageId && excludeMessageIds.has(candidate.messageId)) continue;
        if (sinceMs && candidate.timestampMs && candidate.timestampMs < sinceMs) continue;
        if (maxOtpAgeSeconds > 0 && candidate.timestampMs && now - candidate.timestampMs > maxOtpAgeSeconds * 1000) continue;
        return { candidate, skippedOldOtp };
      }
      return { candidate: null, skippedOldOtp };
    };

    if (!normalizedEmail || !domain) {
      this.log('❌ Email không hợp lệ để lấy OTP.', 'ERROR');
      return null;
    }

    const isTinyhostProvider = provider.mode === 'tinyhost' || provider.label === 'tinyhost';
    const tinyhostParts = normalizedEmail.split('@');
    const tinyhostUser = tinyhostParts[0] || '';
    const url = isTinyhostProvider
      ? `${provider.baseUrl}/api/email/${encodeURIComponent(domain)}/${encodeURIComponent(tinyhostUser)}/?page=1&limit=20`
      : provider.baseUrl
        ? `${provider.baseUrl}/api/messages/${encodeURIComponent(normalizedEmail)}/${encodeURIComponent(provider.apiKey)}`
        : provider.url;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'application/json, text/plain, */*',
      Referer: provider.referer,
      Origin: provider.origin || provider.baseUrl,
    };

    this.log(`⏳ Checking ${provider.label} inbox for ${normalizedEmail}...`);

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      if (shouldStop()) return null;
      let retryPayload = null;
      try {
        const response = await fetch(url, { headers, timeout: 20000 });
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

        const rawText = await response.text();
        let data = null;
        try { data = rawText ? JSON.parse(rawText) : {}; } catch { data = { raw: rawText }; }

        if (isTinyhostProvider && Array.isArray(data?.emails) && data.emails.length > 0) {
          const detailedEmails = [];
          for (const message of data.emails.slice(0, 5)) {
            const messageId = `${message?.id || message?.message_id || ''}`.trim();
            if (!messageId) {
              detailedEmails.push(message);
              continue;
            }
            try {
              const detailUrl = `${provider.baseUrl}/api/email/${encodeURIComponent(domain)}/${encodeURIComponent(tinyhostUser)}/${encodeURIComponent(messageId)}`;
              const detailResponse = await fetch(detailUrl, { headers, timeout: 12000 });
              if (!detailResponse.ok) throw new Error(`HTTP ${detailResponse.status}`);
              const detail = await detailResponse.json().catch(() => null);
              detailedEmails.push({ ...message, ...(detail || {}) });
            } catch {
              detailedEmails.push(message);
            }
          }
          data = { ...data, emails: detailedEmails };
        }

        const candidates = collectCandidates(data);
        const { candidate, skippedOldOtp } = selectFreshCandidate(candidates);
        retryPayload = { attempt, candidates, skippedOldOtp };

        if (candidate?.otp) {
          this.lastOtpByEmail.set(normalizedEmail, candidate.otp);
          this.log(`✅ Retrieved ${provider.label} verification code: ${candidate.otp}`);
          return candidate.otp;
        }

        if (skippedOldOtp && attempt % 2 === 1) {
          this.log(`⏳ ${provider.label} trả OTP cũ ${skippedOldOtp}; bỏ qua, chờ OTP mới (${attempt}/${maxRetries})...`, 'WARNING');
        } else if (attempt % 3 === 1) {
          this.log(`⏳ ${provider.label} mail chưa tới, retry... (${attempt}/${maxRetries})`);
        }
      } catch (error) {
        retryPayload = { attempt, error };
        if (attempt % 3 === 1) this.log(`⚠️ ${provider.label} inbox lỗi tạm thời cho ${normalizedEmail}: ${error.message}`, 'WARNING');
      }

      if (attempt < maxRetries) {
        if (onRetry) await onRetry(retryPayload || { attempt });
        await this.sleep(delay * 1000);
      }
    }

    return null;
  }

  async getHotmailOauth2Code({
    email,
    refreshToken,
    clientId,
    endpointUrl = 'https://tools.dongvanfb.net/api/get_code_oauth2',
    graphEndpointUrl = 'https://tools.dongvanfb.net/api/graph_code',
    oauthMessagesEndpointUrl = 'https://tools.dongvanfb.net/api/get_messages_oauth2',
    graphMessagesEndpointUrl = 'https://tools.dongvanfb.net/api/graph_messages',
    type = 'all',
    maxRetries = 5,
    delay = 5,
    maxOtpAgeSeconds = 60,
    shouldStop = () => false,
    onRetry = null,
    onExhausted = null,
  } = {}) {
    const requestEmail = `${email || ''}`.trim();
    const normalizedEmail = requestEmail.toLowerCase();
    const endpoints = [
      { label: 'OAuth2 messages', url: `${oauthMessagesEndpointUrl || 'https://tools.dongvanfb.net/api/get_messages_oauth2'}`.trim(), mode: 'messages' },
      { label: 'Graph messages', url: `${graphMessagesEndpointUrl || 'https://tools.dongvanfb.net/api/graph_messages'}`.trim(), mode: 'messages' },
      { label: 'OAuth2 code', url: `${endpointUrl || 'https://tools.dongvanfb.net/api/get_code_oauth2'}`.trim(), mode: 'code' },
      { label: 'Graph code', url: `${graphEndpointUrl || 'https://tools.dongvanfb.net/api/graph_code'}`.trim(), mode: 'code' },
    ]
      .filter((item) => item.url)
      .filter((item, index, arr) => arr.findIndex((other) => other.url === item.url) === index);

    if (!normalizedEmail || !refreshToken || !clientId) {
      this.log(`❌ Hotmail OAuth2 thiếu email/refresh_token/client_id cho ${normalizedEmail || 'unknown'}.`, 'ERROR');
      return null;
    }

    const parseHotmailOtpDate = (value) => {
      const text = `${value || ''}`.trim();
      const vnMatch = text.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (vnMatch) {
        const [, hour, minute, day, month, year] = vnMatch;
        const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), 0, 0);
        const time = date.getTime();
        return Number.isNaN(time) ? null : time;
      }
      const isoTime = Date.parse(text);
      return Number.isNaN(isoTime) ? null : isoTime;
    };
    const parsedMaxRetries = Number.parseInt(maxRetries, 10);
    const normalizedMaxRetries = Math.min(5, Math.max(1, Number.isNaN(parsedMaxRetries) ? 5 : parsedMaxRetries));
    const parsedDelay = Number.parseInt(delay, 10);
    const normalizedDelay = Math.max(1, Number.isNaN(parsedDelay) ? 5 : parsedDelay);
    const parsedMaxOtpAgeSeconds = Number.parseInt(maxOtpAgeSeconds, 10);
    const normalizedMaxOtpAgeSeconds = Number.isNaN(parsedMaxOtpAgeSeconds) ? 60 : Math.max(0, parsedMaxOtpAgeSeconds);
    const maxOtpAgeMs = normalizedMaxOtpAgeSeconds * 1000;

    const buildPayload = (mode) => ({
      email: requestEmail,
      refresh_token: refreshToken,
      client_id: clientId,
      ...(mode === 'messages' ? { list_mail: 'all' } : { type }),
    });

    const callHotmailApi = async ({ label, url, mode }) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify(buildPayload(mode)),
      });

      if (!response.ok) throw new Error(`${label} HTTP ${response.status}`);
      return response.json();
    };

    const normalizeMailText = (value) => `${value || ''}`
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();

    const extractOtpFromText = (value) => {
      const text = normalizeMailText(value);
      const patterns = [
        /temporary\s+chatgpt\s+verification\s+code[\s\S]{0,120}?continue[:\s]+(\d{6})/i,
        /verification\s+code[^\d]{0,80}(\d{6})/i,
        /continue[:\s]+(\d{6})/i,
        /code(?:\s+is|\s*:|\s*-)?\s*(\d{6})/i,
        /(\d{6})\s+is\s+your/i,
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match?.[1]) return `${match[1]}`.trim();
      }
      const matches = [...text.matchAll(/\b\d{6}\b/g)].map((item) => `${item[0]}`.trim()).filter(Boolean);
      return matches.length > 0 ? matches[matches.length - 1] : '';
    };

    const pickOtpFromResult = (result, endpointLabel) => {
      const responseEmail = `${result.email || ''}`.trim().toLowerCase();
      if (responseEmail && responseEmail !== normalizedEmail) {
        this.log(`⚠️ Hotmail ${endpointLabel} trả email không khớp cho ${normalizedEmail}, bỏ qua response.`, 'WARNING');
        return null;
      }

      const messages = Array.isArray(result.messages) ? result.messages : [];
      const candidates = [];
      for (const message of messages) {
        const messageCode = `${message.code || ''}`.trim();
        const fromText = Array.isArray(message.from)
          ? message.from.map((item) => `${item.name || ''} ${item.address || ''}`).join(' ')
          : `${message.from || ''}`;
        const subjectText = `${message.subject || ''}`;
        const plainBodyText = normalizeMailText(`${message.message || ''} ${message.content || ''}`);
        const htmlBodyText = `${message.html || ''}`;
        const searchText = `${fromText} ${subjectText} ${plainBodyText}`;
        const parsedCode = extractOtpFromText(`${subjectText} ${plainBodyText}`) || extractOtpFromText(htmlBodyText);
        const code = /^\d{6}$/.test(parsedCode) ? parsedCode : /^\d{6}$/.test(messageCode) ? messageCode : '';
        if (!/^\d{6}$/.test(code)) continue;
        const looksLikeOpenAi = /openai|chatgpt|noreply@tm\d*\.openai\.com/i.test(searchText);
        if (!looksLikeOpenAi) continue;
        const time = parseHotmailOtpDate(message.date || result.date);
        candidates.push({
          code,
          rawCode: messageCode,
          date: message.date || result.date,
          time: time || 0,
          from: fromText.trim(),
          source: endpointLabel,
        });
      }

      candidates.sort((a, b) => b.time - a.time);
      if (candidates.length > 0 && /messages/i.test(endpointLabel)) {
        const summary = candidates.slice(0, 5).map((item) => `${item.code}@${item.date || 'no-date'}`).join(', ');
        this.log(`📬 Hotmail ${endpointLabel} candidates newest-first: ${summary}`);
      }
      if (candidates.length > 0) return candidates[0];

      const singleSourceText = normalizeMailText(`${result.from || ''} ${result.subject || ''} ${result.message || ''} ${result.content || ''} ${result.html || ''}`);
      const singleParsedCode = extractOtpFromText(singleSourceText);
      const singleCode = /^\d{6}$/.test(singleParsedCode)
        ? singleParsedCode
        : /^\d{6}$/.test(`${result.code || ''}`.trim())
          ? `${result.code || ''}`.trim()
          : '';
      const singleLooksLikeOpenAi = /openai|chatgpt|noreply@tm\d*\.openai\.com/i.test(singleSourceText);
      if (/^\d{6}$/.test(singleCode) && singleLooksLikeOpenAi) {
        return {
          code: singleCode,
          rawCode: `${result.code || ''}`.trim(),
          date: result.date || '',
          time: parseHotmailOtpDate(result.date) || 0,
          from: `${result.from || ''}`.trim(),
          source: endpointLabel,
        };
      }
      return null;
    };

    this.log(`✉️ Hotmail OTP: đang request mailbox messages cho ${requestEmail} mỗi retry...`);

    for (let attempt = 0; attempt < normalizedMaxRetries; attempt += 1) {
      if (shouldStop()) return null;

      for (const endpoint of endpoints) {
        if (shouldStop()) return null;
        try {
          const result = await callHotmailApi(endpoint);
          const otp = pickOtpFromResult(result, endpoint.label);

          if (otp?.code) {
            const otpTime = parseHotmailOtpDate(otp.date);
            if (!otpTime) {
              this.log(`⏳ Bỏ qua Hotmail OTP không có timestamp từ ${otp.source} cho ${requestEmail}: ${otp.code}. Chờ mail mới có date...`, 'WARNING');
              continue;
            }
            const now = Date.now();
            const ageMs = now - otpTime;
            if (normalizedMaxOtpAgeSeconds > 0 && ageMs > maxOtpAgeMs) {
              const ageSeconds = Math.max(0, Math.round(ageMs / 1000));
              this.log(`⏳ Bỏ qua Hotmail OTP cũ quá ${normalizedMaxOtpAgeSeconds}s cho ${requestEmail}: ${otp.code} (${otp.date}, age=${ageSeconds}s). Chờ OTP mới...`, 'WARNING');
              continue;
            }
            if (ageMs < -60 * 1000) {
              this.log(`⚠️ Hotmail OTP có timestamp lệch tương lai bất thường cho ${requestEmail}: ${otp.code} (${otp.date}). Bỏ qua response này.`, 'WARNING');
              continue;
            }
            const ageSeconds = Math.max(0, Math.round(ageMs / 1000));
            const rawCodeNote = otp.rawCode && otp.rawCode !== otp.code ? ` | raw=${otp.rawCode}` : '';
            this.log(`✅ Hotmail ${otp.source} OTP mới received for ${requestEmail}: ${otp.code} (${otp.date}, age=${ageSeconds}s)${otp.from ? ` from ${otp.from}` : ''}${rawCodeNote}`);
            return otp.code;
          } else if (attempt % 3 === 0) {
            const messageCount = Array.isArray(result.messages) ? result.messages.length : 0;
            this.log(`⏳ Hotmail ${endpoint.label} chưa có OTP cho ${requestEmail}. status=${result.status}, messages=${messageCount}`);
          }
        } catch (error) {
          if (attempt % 3 === 0) this.log(`⚠️ Hotmail ${endpoint.label} lỗi tạm thời cho ${normalizedEmail}: ${error.message}`, 'WARNING');
        }
      }

      if (attempt < normalizedMaxRetries - 1) {
        if (attempt % 3 === 0) this.log(`⏳ Hotmail OTP chưa có mail, request lại mailbox... (${attempt + 1}/${normalizedMaxRetries})`);
        if (typeof onRetry === 'function') {
          await onRetry({ attempt: attempt + 1, maxRetries: normalizedMaxRetries, email: requestEmail }).catch((error) => {
            this.log(`⚠️ Hotmail OTP retry hook lỗi: ${error.message}`, 'WARNING');
          });
        }
        await this.sleep(normalizedDelay * 1000);
      }
    }

    this.log(`❌ Hotmail code/messages API không lấy được OTP cho ${normalizedEmail} sau ${normalizedMaxRetries}/${normalizedMaxRetries} lần thử.`, 'ERROR');
    if (typeof onExhausted === 'function') {
      await onExhausted({ email: requestEmail, maxRetries: normalizedMaxRetries, reason: 'hotmail_otp_exhausted' }).catch((error) => {
        this.log(`⚠️ Hotmail OTP exhausted hook lỗi: ${error.message}`, 'WARNING');
      });
    }
    return null;
  }
}
