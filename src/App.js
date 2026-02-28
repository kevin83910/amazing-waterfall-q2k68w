import React, { useState, useEffect } from "react";
import {
  MapPin,
  AlertCircle,
  CalendarCheck,
  ChevronRight,
  Settings,
  Save,
  Plus,
  Trash2,
  Eye,
  Lock,
  X,
  Key,
  Clock,
  MessageCircle,
} from "lucide-react";

// --- 初始預設資料 (支援多位設計師與時段滿檔狀態) ---
const initialDesigners = [
  {
    id: "d1",
    name: "魚魚",
    location: "北車店 15樓",
    schedules: [
      {
        id: 1,
        fullDate: "2026-03-12",
        date: "3/12",
        day: "四",
        times: [
          { val: "11:00", isFull: false },
          { val: "13:00", isFull: true },
          { val: "15:00", isFull: false },
          { val: "17:00", isFull: false },
        ],
      },
      {
        id: 2,
        fullDate: "2026-03-13",
        date: "3/13",
        day: "五",
        times: [
          { val: "13:00", isFull: false },
          { val: "15:00", isFull: true },
          { val: "19:00", isFull: false },
        ],
      },
      {
        id: 3,
        fullDate: "2026-03-14",
        date: "3/14",
        day: "六",
        times: [
          { val: "11:00", isFull: false },
          { val: "15:00", isFull: false },
          { val: "17:00", isFull: false },
          { val: "19:00", isFull: false },
        ],
      },
      {
        id: 4,
        fullDate: "2026-03-15",
        date: "3/15",
        day: "日",
        times: [{ val: "17:00", isFull: false }],
      },
    ],
  },
  {
    id: "d2",
    name: "Mika",
    location: "中山店 2樓",
    schedules: [
      {
        id: 1,
        fullDate: "2026-03-16",
        date: "3/16",
        day: "一",
        times: [
          { val: "12:00", isFull: false },
          { val: "14:00", isFull: false },
          { val: "16:00", isFull: true },
        ],
      },
      {
        id: 2,
        fullDate: "2026-03-17",
        date: "3/17",
        day: "二",
        times: [
          { val: "13:00", isFull: false },
          { val: "15:00", isFull: false },
        ],
      },
    ],
  },
];

// ==========================================
// 子元件：單日班表編輯器 (處理標籤化時間與客滿狀態)
// ==========================================
const ScheduleItemEditor = ({ schedule, onRemove, onUpdate, onDateChange }) => {
  const [newTime, setNewTime] = useState("");

  const handleAddTime = () => {
    if (!newTime) return;
    if (schedule.times.some((t) => t.val === newTime)) return; // 避免重複加入

    // 將新時間加入並排序
    const updatedTimes = [
      ...schedule.times,
      { val: newTime, isFull: false },
    ].sort((a, b) => a.val.localeCompare(b.val));
    onUpdate(schedule.id, "times", updatedTimes);
    setNewTime(""); // 清空輸入框
  };

  const handleRemoveTime = (timeToRemove) => {
    const updatedTimes = schedule.times.filter((t) => t.val !== timeToRemove);
    onUpdate(schedule.id, "times", updatedTimes);
  };

  const handleToggleFull = (timeToToggle) => {
    const updatedTimes = schedule.times.map((t) =>
      t.val === timeToToggle ? { ...t, isFull: !t.isFull } : t
    );
    onUpdate(schedule.id, "times", updatedTimes);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative group mb-3">
      <button
        onClick={() => onRemove(schedule.id)}
        className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition shadow-sm"
        title="刪除此日期"
      >
        <Trash2 size={14} />
      </button>

      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <label className="block text-[10px] text-gray-400 mb-1">
            選擇開放日期
          </label>
          <input
            type="date"
            value={schedule.fullDate || ""}
            onChange={(e) => onDateChange(schedule.id, e.target.value)}
            className="w-full p-2 border rounded-lg text-sm font-bold text-gray-700 focus:border-[#A87B7B] outline-none cursor-pointer bg-gray-50 hover:bg-white transition"
          />
        </div>
        <div className="w-16 bg-gray-50 border border-gray-100 rounded-lg flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-gray-800">
            {schedule.date || "-"}
          </span>
          <span className="text-[10px] text-gray-500">
            {schedule.day ? "週" + schedule.day : "-"}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-gray-400 mb-1">新增時段</label>
        <div className="flex gap-2 mb-3">
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="flex-1 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-[#A87B7B] outline-none"
          />
          <button
            onClick={handleAddTime}
            className="bg-[#A87B7B] text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-[#8f6666] transition shadow-sm"
          >
            加入
          </button>
        </div>

        {/* 時間標籤顯示區 */}
        <p className="text-[10px] text-[#A87B7B] mb-2 font-bold">
          💡 點擊下方時段標籤，可切換「已滿 / 預約」狀態
        </p>
        <div className="flex flex-wrap gap-2">
          {schedule.times.map((t, i) => (
            <div
              key={i}
              className={`flex items-center gap-1 border px-2.5 py-1 rounded-md shadow-sm transition-colors ${
                t.isFull
                  ? "bg-gray-100 border-gray-300 text-gray-500"
                  : "bg-[#FDFBF7] border-[#F0E6D8] text-[#A87B7B]"
              }`}
            >
              <Clock
                size={12}
                className={t.isFull ? "opacity-50" : "opacity-70"}
              />
              <button
                onClick={() => handleToggleFull(t.val)}
                className={`text-xs font-bold hover:underline ${
                  t.isFull ? "line-through opacity-70" : ""
                }`}
                title="點擊切換狀態"
              >
                {t.val} {t.isFull && "(已滿)"}
              </button>
              <button
                onClick={() => handleRemoveTime(t.val)}
                className={`ml-1 rounded-full p-0.5 transition ${
                  t.isFull
                    ? "hover:text-red-500 hover:bg-red-100"
                    : "text-[#A87B7B] hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {schedule.times.length === 0 && (
            <span className="text-xs text-gray-400 py-1">尚未加入任何時段</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 主程式 App
// ==========================================
export default function App() {
  // --- 系統樣式載入狀態 (防止破圖閃爍 FOUC) ---
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (document.getElementById("tailwind-script")) {
        setIsStyleLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "tailwind-script";
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => {
        // 樣式檔案下載完成後，稍微等待 100 毫秒讓瀏覽器套用，再顯示畫面
        setTimeout(() => setIsStyleLoaded(true), 100);
      };
      document.head.appendChild(script);
    }
  }, []);

  // --- 系統狀態管理 ---
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // --- 密碼與全域設定 ---
  const [adminPassword, setAdminPassword] = useState("admin");
  const [lineOfficialId, setLineOfficialId] = useState(""); // LINE 跳轉設定

  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showForgotPrompt, setShowForgotPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");

  const [designerToDelete, setDesignerToDelete] = useState(null);
  const [showCopyModal, setShowCopyModal] = useState(false);

  // --- 顯示提示訊息 (Toast) ---
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // --- 商家資料狀態 (支援多位設計師) ---
  const [designers, setDesigners] = useState(initialDesigners);
  const [activeDesignerId, setActiveDesignerId] = useState(
    initialDesigners[0].id
  );

  const activeDesigner =
    designers.find((d) => d.id === activeDesignerId) || designers[0];

  // --- 後台登入處理 ---
  const handleAdminLogin = () => {
    if (passwordInput === adminPassword) {
      setIsAdminMode(true);
      setShowPasswordPrompt(false);
      setPasswordInput("");
      setPasswordError("");
    } else {
      setPasswordError("密碼錯誤，請重新輸入！");
      setPasswordInput("");
    }
  };

  // --- 忘記密碼處理 ---
  const handleResetPassword = () => {
    if (passwordInput === "8888") {
      setAdminPassword("admin");
      setShowForgotPrompt(false);
      setShowPasswordPrompt(true);
      setPasswordInput("");
      setPasswordError("");
      showToast("密碼已成功重置為：admin");
    } else {
      setPasswordError("安全驗證碼錯誤！");
      setPasswordInput("");
    }
  };

  // --- 後台變更密碼 ---
  const handleChangePassword = () => {
    if (!newPasswordInput) return showToast("請輸入新密碼！");
    if (newPasswordInput.length < 4) return showToast("密碼長度至少需 4 碼！");

    setAdminPassword(newPasswordInput);
    setNewPasswordInput("");
    showToast("密碼修改成功！下次請使用新密碼登入。");
  };

  // --- 後台編輯設計師功能 ---
  const updateActiveDesigner = (field, value) => {
    setDesigners(
      designers.map((d) =>
        d.id === activeDesignerId ? { ...d, [field]: value } : d
      )
    );
  };

  const handleAddDesigner = () => {
    const newId = "d" + Date.now();
    setDesigners([
      ...designers,
      { id: newId, name: "新設計師", location: "請輸入地點", schedules: [] },
    ]);
    setActiveDesignerId(newId);
  };

  const handleRemoveDesignerClick = (id) => {
    if (designers.length <= 1) {
      showToast("至少需保留一位設計師！");
      return;
    }
    setDesignerToDelete(id);
  };

  const confirmDeleteDesigner = () => {
    const filtered = designers.filter((d) => d.id !== designerToDelete);
    setDesigners(filtered);
    if (activeDesignerId === designerToDelete)
      setActiveDesignerId(filtered[0].id);
    setDesignerToDelete(null);
    showToast("已成功刪除設計師");
  };

  // --- 後台編輯班表功能 ---
  const handleAddSchedule = () => {
    const schedules = activeDesigner.schedules;
    const newId =
      schedules.length > 0 ? Math.max(...schedules.map((s) => s.id)) + 1 : 1;
    const newSchedules = [
      ...schedules,
      { id: newId, fullDate: "", date: "", day: "", times: [] },
    ];
    updateActiveDesigner("schedules", newSchedules);
  };

  const handleRemoveSchedule = (id) => {
    const newSchedules = activeDesigner.schedules.filter((s) => s.id !== id);
    updateActiveDesigner("schedules", newSchedules);
  };

  const handleUpdateSchedule = (id, field, value) => {
    const newSchedules = activeDesigner.schedules.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    updateActiveDesigner("schedules", newSchedules);
  };

  const handleDateChange = (id, dateString) => {
    if (!dateString) {
      const newSchedules = activeDesigner.schedules.map((s) =>
        s.id === id ? { ...s, fullDate: "", date: "", day: "" } : s
      );
      updateActiveDesigner("schedules", newSchedules);
      return;
    }
    const d = new Date(dateString);
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const dayIndex = d.getDay();
    const daysMap = ["日", "一", "二", "三", "四", "五", "六"];

    const newSchedules = activeDesigner.schedules.map((s) =>
      s.id === id
        ? {
            ...s,
            fullDate: dateString,
            date: `${month}/${date}`,
            day: daysMap[dayIndex],
          }
        : s
    );
    updateActiveDesigner("schedules", newSchedules);
  };

  // --- 複製預約資訊功能 ---
  const handleCopyBooking = () => {
    if (!selectedTime) {
      showToast("請先點選您想要的時段喔！");
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = selectedTime;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setShowCopyModal(true);
    } catch (err) {
      console.error("複製失敗", err);
      showToast("複製失敗，請手動輸入");
    }
    document.body.removeChild(textArea);
  };

  // --- 開啟 LINE 跳轉 ---
  const jumpToLine = () => {
    setShowCopyModal(false);
    if (lineOfficialId) {
      // LINE Official Account Deep Link (自動帶入複製好的文字)
      const formattedLineId = lineOfficialId.startsWith("@")
        ? lineOfficialId
        : `@${lineOfficialId}`;
      const lineUrl = `https://line.me/R/oaMessage/${formattedLineId}/?${encodeURIComponent(
        selectedTime
      )}`;
      window.open(lineUrl, "_blank");
    }
  };

  // ==========================================
  // 共用 UI：Toast 提示訊息
  // ==========================================
  const renderToast = () => {
    if (!toastMessage) return null;
    return (
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[200] bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl text-sm font-bold opacity-90 transition-opacity duration-300 whitespace-nowrap">
        {toastMessage}
      </div>
    );
  };

  // ==========================================
  // 優雅的載入畫面 (避免樣式閃爍破圖)
  // ==========================================
  if (!isStyleLoaded) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #F0E6D8",
            borderTop: "3px solid #A87B7B",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p
          style={{
            marginTop: "16px",
            color: "#A87B7B",
            fontWeight: "bold",
            fontSize: "14px",
            letterSpacing: "1px",
          }}
        >
          專屬頁面載入中...
        </p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ==========================================
  // 視圖 1：後台編輯模式 (Admin View)
  // ==========================================
  const renderAdminView = () => (
    <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl relative pb-24 flex flex-col mx-auto border-x border-gray-200">
      {renderToast()}

      {/* 刪除設計師確認視窗 */}
      {designerToDelete && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[320px] shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              確定刪除設計師？
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              此動作無法復原，與該設計師相關的所有班表與設定都會被永久刪除。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDesignerToDelete(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteDesigner}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition shadow-sm shadow-red-200"
              >
                確定刪除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 後台 Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="font-bold flex items-center gap-2">
          <Settings size={18} /> 班表後台管理
        </h1>
        <button
          onClick={() => setIsAdminMode(false)}
          className="bg-white text-gray-900 text-sm px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-gray-200 transition"
        >
          <Eye size={16} /> 預覽畫面
        </button>
      </div>

      {/* 後台設計師切換列 */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 overflow-x-auto border-b border-gray-200 shadow-sm sticky top-[60px] z-40">
        {designers.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDesignerId(d.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              activeDesignerId === d.id
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {d.name}
          </button>
        ))}
        <button
          onClick={handleAddDesigner}
          className="flex-shrink-0 flex items-center gap-1 text-[#A87B7B] text-sm font-bold px-3 py-1.5 bg-[#F5E3E3] rounded-full hover:bg-[#F0E6D8] transition"
        >
          <Plus size={16} /> 新增
        </button>
      </div>

      <div className="p-5 space-y-6 flex-1 overflow-y-auto">
        {/* 基本資料設定 */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">
            基本資料設定
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                設計師名稱
              </label>
              <input
                type="text"
                value={activeDesigner.name}
                onChange={(e) => updateActiveDesigner("name", e.target.value)}
                className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#A87B7B] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                服務地點
              </label>
              <input
                type="text"
                value={activeDesigner.location}
                onChange={(e) =>
                  updateActiveDesigner("location", e.target.value)
                }
                className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#A87B7B] outline-none transition"
              />
            </div>

            <button
              onClick={() => handleRemoveDesignerClick(activeDesigner.id)}
              className="w-full mt-4 bg-red-50 text-red-500 text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-1 hover:bg-red-500 hover:text-white transition"
            >
              <Trash2 size={16} /> 刪除此設計師
            </button>
          </div>
        </div>

        {/* 班表設定 (採用標籤化子元件) */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">可預約時段設定</h2>
            <button
              onClick={handleAddSchedule}
              className="text-[#A87B7B] text-sm font-bold flex items-center gap-1 bg-[#F5E3E3] px-3 py-1.5 rounded-lg hover:bg-[#F0E6D8] transition"
            >
              <Plus size={16} /> 新增日期
            </button>
          </div>

          <div>
            {activeDesigner.schedules.map((schedule) => (
              <ScheduleItemEditor
                key={schedule.id}
                schedule={schedule}
                onRemove={handleRemoveSchedule}
                onUpdate={handleUpdateSchedule}
                onDateChange={handleDateChange}
              />
            ))}

            {activeDesigner.schedules.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                目前沒有任何開放時段，請點擊上方新增。
              </div>
            )}
          </div>
        </div>

        {/* 安全與帳號設定 (修改密碼 & LINE 跳轉) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-8">
          <h2 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
            <Key size={16} className="text-[#A87B7B]" /> 全域系統設定
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-bold text-[#A87B7B]">
                一鍵跳轉 LINE 設定
              </label>
              <input
                type="text"
                placeholder="輸入官方帳號 ID (如：@lashbeauty)"
                value={lineOfficialId}
                onChange={(e) => setLineOfficialId(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#A87B7B] outline-none transition"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                設定後，顧客選好時間將出現「跳轉 LINE」按鈕自動帶入文字。
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs text-gray-500 mb-1">
                變更管理密碼
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="輸入新密碼"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#A87B7B] outline-none transition"
                />
                <button
                  onClick={handleChangePassword}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition flex-shrink-0"
                >
                  更新
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0 z-50">
        <button
          onClick={() => setIsAdminMode(false)}
          className="w-full bg-[#A87B7B] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#8f6666] transition shadow-lg shadow-[#A87B7B]/20"
        >
          <Save size={18} /> 儲存並查看顧客預覽
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 視圖 2：顧客預約模式 (Customer View)
  // ==========================================
  const renderCustomerView = () => (
    <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative pb-24 mx-auto border-x border-gray-200">
      {renderToast()}

      {/* 顧客端：設計師切換列 & 進入後台按鈕 */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pr-4 no-scrollbar">
          {designers.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setActiveDesignerId(d.id);
                setSelectedTime(null);
              }}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeDesignerId === d.id
                  ? "bg-[#A87B7B] text-white shadow-md"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowPasswordPrompt(true)}
          className="flex-shrink-0 bg-gray-50 text-gray-400 p-2 rounded-full hover:bg-gray-200 hover:text-gray-600 transition"
          title="後台管理"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* 密碼輸入彈窗 */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[320px] shadow-2xl relative">
            <button
              onClick={() => {
                setShowPasswordPrompt(false);
                setPasswordInput("");
                setPasswordError("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center mb-4 mt-2">
              <div className="bg-[#F5E3E3] p-3 rounded-full text-[#A87B7B] mb-3">
                <Lock size={24} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                請輸入後台密碼
              </h2>
            </div>

            <input
              type="password"
              placeholder="請輸入密碼"
              className={`w-full p-3 border rounded-xl text-center mb-2 outline-none transition focus:ring-2 
                ${
                  passwordError
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:ring-[#A87B7B]"
                }`}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
              autoFocus
            />

            {/* 錯誤提示文字 */}
            <div className="h-6 flex justify-center items-start mb-2">
              {passwordError && (
                <span className="text-xs text-red-500 font-bold">
                  {passwordError}
                </span>
              )}
            </div>

            <button
              onClick={handleAdminLogin}
              className="w-full bg-[#A87B7B] text-white py-3 rounded-xl font-bold hover:bg-[#8f6666] transition shadow-md mb-4"
            >
              登入管理後台
            </button>

            {/* 忘記密碼按鈕 */}
            <div className="text-center">
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setShowForgotPrompt(true);
                  setPasswordInput("");
                  setPasswordError("");
                }}
                className="text-xs text-gray-400 hover:text-[#A87B7B] underline underline-offset-2 transition"
              >
                忘記密碼？
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 忘記密碼 - 重置彈窗 */}
      {showForgotPrompt && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[320px] shadow-2xl relative">
            <button
              onClick={() => {
                setShowForgotPrompt(false);
                setPasswordInput("");
                setPasswordError("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center mb-4 mt-2">
              <div className="bg-gray-100 p-3 rounded-full text-gray-600 mb-3">
                <Key size={24} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">重置密碼</h2>
            </div>

            <input
              type="text"
              placeholder="請輸入安全碼"
              className={`w-full p-3 border rounded-xl text-center mb-2 outline-none transition focus:ring-2 
                ${
                  passwordError
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:ring-gray-400"
                }`}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
              autoFocus
            />

            <div className="h-6 flex justify-center items-start mb-2">
              {passwordError && (
                <span className="text-xs text-red-500 font-bold">
                  {passwordError}
                </span>
              )}
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-black transition shadow-md mb-3"
            >
              確認重置
            </button>
            <button
              onClick={() => {
                setShowForgotPrompt(false);
                setShowPasswordPrompt(true);
                setPasswordInput("");
                setPasswordError("");
              }}
              className="w-full py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition"
            >
              返回登入
            </button>
          </div>
        </div>
      )}

      {/* 顧客預約成功複製的提示彈窗 */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[320px] shadow-2xl text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-[#FDFBF7] text-[#A87B7B] rounded-full flex items-center justify-center mx-auto mb-4">
              {lineOfficialId ? (
                <MessageCircle size={32} />
              ) : (
                <CalendarCheck size={32} />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              已複製預約資訊！
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              您的預約時段已經複製到剪貼簿囉！
              <br />
              {lineOfficialId
                ? "請點擊下方按鈕，系統將為您切換至 LINE 聊天室，只要「貼上」即可完成申請喔。"
                : "請直接回到 LINE 聊天室「貼上」並送出，即可完成申請。"}
            </p>
            <button
              onClick={
                lineOfficialId ? jumpToLine : () => setShowCopyModal(false)
              }
              className="w-full py-3 bg-[#A87B7B] text-white rounded-xl font-bold hover:bg-[#8f6666] transition shadow-sm flex items-center justify-center gap-2"
            >
              {lineOfficialId ? "前往 LINE 貼上傳送" : "我知道了，前往貼上"}
            </button>
          </div>
        </div>
      )}

      {/* Header 視覺區 */}
      <div className="relative h-48 bg-gradient-to-br from-[#E8D3C8] to-[#D4B8A8] rounded-b-[2.5rem] p-6 flex flex-col justify-end overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-1/4 -translate-x-1/4"></div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-lg overflow-hidden">
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[#A87B7B] text-xl font-bold font-serif">
              {activeDesigner.name.charAt(0)}
            </div>
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold tracking-wide">
              設計師｜{activeDesigner.name}
            </h1>
            <p className="text-sm opacity-90 mt-1 flex items-center gap-1">
              <MapPin size={14} /> {activeDesigner.location}
            </p>
          </div>
        </div>
      </div>

      {/* 預約須知警告框 */}
      <div className="px-5 -mt-6 relative z-20">
        <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4">
          <div className="flex items-start gap-3">
            <div className="bg-red-50 p-2 rounded-full text-red-500 mt-0.5">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                預約重要須知
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                請直接{" "}
                <span className="text-red-500 font-bold">截圖或回傳訊息</span>{" "}
                告知您想預約的時間。
                <br />❌ 僅在此處點擊無法直接完成預約喔！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 班表列表區 */}
      <div className="p-5 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <CalendarCheck size={20} className="text-[#A87B7B]" />
            本月空檔查詢
          </h2>
          <span className="text-xs text-gray-400">點擊時段可複製</span>
        </div>

        <div className="space-y-4">
          {activeDesigner.schedules.map((schedule) => {
            const isWeekend = schedule.day === "六" || schedule.day === "日";
            const times = schedule.times || [];

            if (times.length === 0) return null;

            return (
              <div key={schedule.id} className="flex gap-4">
                <div className="flex flex-col items-center pt-1 w-12 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-800">
                    {schedule.date}
                  </span>
                  <span
                    className={`text-xs mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${
                      isWeekend
                        ? "bg-[#F5E3E3] text-[#A87B7B] font-bold"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {schedule.day}
                  </span>
                </div>

                <div className="flex-1 border-b border-gray-100 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {times.map((tObj, tIndex) => {
                      // 若已客滿，渲染不能點擊的灰色按鈕
                      if (tObj.isFull) {
                        return (
                          <button
                            key={tIndex}
                            disabled
                            className="px-3 py-1.5 border border-gray-200 bg-gray-50 text-gray-400 text-sm rounded-lg cursor-not-allowed line-through opacity-70"
                          >
                            {tObj.val} (已滿)
                          </button>
                        );
                      }

                      // 若未客滿，渲染正常可點擊按鈕
                      return (
                        <button
                          key={tIndex}
                          onClick={() =>
                            setSelectedTime(
                              `預約專屬美麗時光 ✨\n🤍 姓名：\n📱 電話：\n🕰️ 時間：${schedule.date}(${schedule.day}) ${tObj.val} (${activeDesigner.name})\n🎀 項目：`
                            )
                          }
                          className={`px-3 py-1.5 border text-sm rounded-lg transition active:scale-95 shadow-sm
                            ${
                              selectedTime &&
                              selectedTime.includes(
                                `${schedule.date}(${schedule.day}) ${tObj.val}`
                              )
                                ? "bg-[#A87B7B] text-white border-[#A87B7B]"
                                : "bg-white border-gray-200 text-gray-700 hover:border-[#D4B8A8] hover:text-[#A87B7B] hover:bg-[#FDFBF7]"
                            }
                          `}
                        >
                          {tObj.val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {activeDesigner.schedules.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              設計師尚未開放預約時段
            </div>
          )}
        </div>
      </div>

      {/* 底部行動呼籲 */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 p-4 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-30">
        <button
          className="w-full bg-[#A87B7B] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#8f6666] transition shadow-lg shadow-[#A87B7B]/30"
          onClick={handleCopyBooking}
        >
          {selectedTime ? "確認時間並回傳給客服" : "請先點選您想要的時段"}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-200 font-sans flex justify-center">
      {isAdminMode ? renderAdminView() : renderCustomerView()}
    </div>
  );
}
