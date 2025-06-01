const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'xocdia_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Serve static files từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Trang chính
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API ping test
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// --- Ví dụ API đơn giản cho game (Bạn bổ sung logic riêng) ---
// Lấy thông tin user (ví dụ)
app.get('/api/user', (req, res) => {
  // Giả sử user lưu trong session
  if (!req.session.user) {
    req.session.user = {
      id: Date.now(),
      name: 'Người chơi ' + Math.floor(Math.random() * 1000),
      balance: 1000
    };
  }
  res.json(req.session.user);
});

// Đặt cược (ví dụ đơn giản)
app.post('/api/bet', (req, res) => {
  const { betType, amount } = req.body;
  if (!req.session.user) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }
  if (amount > req.session.user.balance) {
    return res.status(400).json({ error: 'Không đủ tiền cược' });
  }

  // Xử lý cược: trừ tiền tạm thời
  req.session.user.balance -= amount;

  // Giả lập kết quả random thắng thua (50/50)
  const win = Math.random() < 0.5;
  if (win) {
    const winAmount = amount * 2;
    req.session.user.balance += winAmount; // thưởng
  }

  res.json({
    win,
    balance: req.session.user.balance,
    message: win ? `Bạn đã thắng ${amount * 2}` : 'Bạn đã thua cược'
  });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server Xóc Đĩa chạy tại http://localhost:${port}`);
});
