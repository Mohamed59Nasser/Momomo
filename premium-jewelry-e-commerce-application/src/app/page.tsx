"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Globe, 
  ShoppingBag, 
  Heart, 
  User, 
  Trash2, 
  Lock, 
  Check, 
  X, 
  Plus, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  AlertCircle, 
  Sliders, 
  RefreshCw, 
  Search, 
  ChevronRight, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ArrowRight,
  ShieldCheck,
  Send
} from "lucide-react";

interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  imageScale: number;
  categoryEn: string;
  categoryAr: string;
  price: number;
  oldPrice: number | null;
  timerEndsAt: string | null;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: number;
  userId: number;
  items: string; // JSON string
  totalPrice: number;
  address: string;
  locationCoords: string | null;
  shippingAgent: string;
  status: string;
  createdAt: string;
}

interface DbUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  locationCoords: string | null;
  isVerified: boolean;
  role: string;
}

// Translations dictionary
const T = {
  EN: {
    shopTitle: "AURÉLIA",
    shopSubtitle: "FINE JEWELRY",
    toggleLang: "عربي",
    heroTitle: "RADIANCE REDEFINED",
    heroSub: "Discover the essence of luminous beauty and exclusive accessories.",
    shopNew: "SHOP NEW ARRIVALS",
    curated: "CURATED CATEGORIES",
    fineJewelry: "FINE JEWELRY",
    timelessElegance: "TIMELESS ELEGANCE",
    shopNow: "SHOP NOW",
    bestsellers: "BESTSELLERS",
    bestsellersSub: "Handcrafted luxury masterpieces set in 18k gold and precious diamonds.",
    addToCart: "ADD TO CART",
    outOfStock: "OUT OF STOCK",
    cartTitle: "Your Shopping Bag",
    emptyCart: "Your bag is currently empty.",
    subtotal: "Subtotal",
    egp: "EGP",
    checkout: "Proceed to Checkout",
    wishlistTitle: "Your Wishlist",
    emptyWishlist: "No treasures saved yet.",
    loginTitle: "Standard Secure Login",
    registerTitle: "Register New Account",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    phoneLabel: "Phone Number (WhatsApp)",
    loginBtn: "Log In",
    registerBtn: "Create Account",
    orRegister: "Don't have an account? Register",
    orLogin: "Already have an account? Log In",
    otpTitle: "WhatsApp OTP Verification",
    otpSubtitle: "We have dispatched a 6-digit verification code to your WhatsApp.",
    otpPlaceholder: "Enter 6-digit OTP",
    verifyBtn: "Verify Code & Proceed",
    addressTitle: "Delivery Address & Location",
    addressPlaceholder: "Enter your full apartment, street, city, and landmarks...",
    pinLocation: "Pin Your GPS Location",
    pinLocationSub: "Select your delivery zone or click the map mock to pin coordinates:",
    shippingNotice: "Shipping is processed via Egypt Post (البريد المصري)",
    saveAddressBtn: "Complete Registration",
    profileTitle: "User Profile",
    ordersTitle: "Order History",
    noOrders: "You have not placed any orders yet.",
    logoutBtn: "Sign Out",
    welcome: "Welcome,",
    adminBadge: "Admin Access",
    unverifiedBadge: "Unverified Number",
    verifiedBadge: "Verified",
    saveProfileBtn: "Update Details",
    orderId: "Order #",
    orderStatus: "Status",
    orderTotal: "Total",
    orderAgent: "Carrier",
    adminTitle: "ADMIN CONTROL PANEL",
    gdLabel: "Image Google Drive Link",
    scaleLabel: "Display Scale",
    priceLabel: "Price (EGP)",
    oldPriceLabel: "Old Price (EGP / Optional)",
    timerLabel: "Countdown (Minutes / Optional)",
    saveProductBtn: "Save Changes",
    timerEnds: "Ends in:",
    hours: "h",
    mins: "m",
    secs: "s",
    promoteUser: "Promote User to Admin",
    userManagement: "Store User Directory",
    makeAdminBtn: "Promote",
    revokeAdminBtn: "Demote",
    activeViewport: "ACTIVE VIEWPORT",
    viewportTitle: "DESIGN ADAPTATION & DEVICE DETECTION SYSTEM",
    viewportDesc: "Interactive graphic demonstrating how the website UI dynamically adjusts to different screen sizes.",
    phoneView: "PHONE / MOBILE (375px - 480px)",
    tabletView: "TABLET / IPAD (768px - 1024px)",
    desktopView: "LAPTOP / DESKTOP (1024px+)",
    resetSimulation: "Reset Frame",
    mockMapTip: "Click on any Cairo landmark below to pin coordinates instantly:",
    navShop: "Shop",
    navCollections: "Collections",
    navSkincare: "Skincare",
    navJournal: "Journal",
    navAbout: "About",
  },
  AR: {
    shopTitle: "أوريليا",
    shopSubtitle: "المجوهرات الراقية",
    toggleLang: "EN",
    heroTitle: "إعادة تعريف البريق",
    heroSub: "اكتشفي جوهر الجمال المضيء والإكسسوارات الفاخرة والحصرية.",
    shopNew: "تسوقي أحدث التشكيلات",
    curated: "أقسام منتقاة بعناية",
    fineJewelry: "مجوهرات راقية",
    timelessElegance: "أناقة خالدة",
    shopNow: "تسوقي الآن",
    bestsellers: "الأكثر مبيعاً",
    bestsellersSub: "روائع فاخرة مصنوعة يدوياً من الذهب عيار 18 والألماس الثمين.",
    addToCart: "أضف إلى السلة",
    outOfStock: "نفذت الكمية",
    cartTitle: "حقيبة التسوق الخاصة بك",
    emptyCart: "حقيبة التسوق فارغة حالياً.",
    subtotal: "المجموع الفرعي",
    egp: "ج.م",
    checkout: "المتابعة لإتمام الطلب",
    wishlistTitle: "قائمة الأمنيات",
    emptyWishlist: "لم يتم حفظ أي قطع حتى الآن.",
    loginTitle: "تسجيل الدخول الآمن",
    registerTitle: "تسجيل حساب جديد",
    nameLabel: "الاسم الكامل",
    emailLabel: "البريد الإلكتروني",
    passwordLabel: "كلمة المرور",
    phoneLabel: "رقم الهاتف (الواتساب)",
    loginBtn: "تسجيل الدخول",
    registerBtn: "إنشاء حساب جديد",
    orRegister: "ليس لديك حساب؟ سجل معنا",
    orLogin: "لديك حساب بالفعل؟ سجل دخولك",
    otpTitle: "التحقق من رمز الواتساب OTP",
    otpSubtitle: "لقد أرسلنا رمز تحقق مكون من 6 أرقام إلى رقم الواتساب الخاص بك.",
    otpPlaceholder: "أدخل الرمز المكون من 6 أرقام",
    verifyBtn: "تأكيد الرمز والمتابعة",
    addressTitle: "عنوان التوصيل وتحديد الموقع",
    addressPlaceholder: "أدخل تفاصيل الشقة، الشارع، المدينة، وأقرب علامة مميزة...",
    pinLocation: "تحديد موقعك على الخريطة",
    pinLocationSub: "اختر منطقة التوصيل أو انقر على الخريطة التوضيحية لتحديد الإحداثيات:",
    shippingNotice: "الشحن يتم حصرياً من خلال البريد المصري (Egypt Post)",
    saveAddressBtn: "إتمام عملية التسجيل",
    profileTitle: "ملف المستخدم",
    ordersTitle: "سجل الطلبات",
    noOrders: "لم تقم بإجراء أي طلبات حتى الآن.",
    logoutBtn: "تسجيل الخروج",
    welcome: "مرحباً،",
    adminBadge: "صلاحيات المشرف",
    unverifiedBadge: "رقم غير مؤكد",
    verifiedBadge: "مؤكد",
    saveProfileBtn: "تحديث البيانات",
    orderId: "طلب رقم #",
    orderStatus: "الحالة",
    orderTotal: "الإجمالي",
    orderAgent: "شركة الشحن",
    adminTitle: "لوحة تحكم المشرف (تعديل فوري)",
    gdLabel: "رابط جوجل درايف للصورة",
    scaleLabel: "حجم العرض الفوري",
    priceLabel: "السعر (ج.م)",
    oldPriceLabel: "السعر السابق (ج.م / اختياري)",
    timerLabel: "مؤقت العد التنازلي (بالدقائق / اختياري)",
    saveProductBtn: "حفظ التعديلات",
    timerEnds: "ينتهي العرض خلال:",
    hours: "ساعة",
    mins: "دقيقة",
    secs: "ثانية",
    promoteUser: "منح رتبة مشرف لمستخدم",
    userManagement: "دليل مستخدمي المتجر",
    makeAdminBtn: "منح مشرف",
    revokeAdminBtn: "إلغاء مشرف",
    activeViewport: "منطقة العرض النشطة",
    viewportTitle: "نظام كشف الأجهزة وتكييف التصميم الراقٍ",
    viewportDesc: "لوحة تحكم تفاعلية توضح كيف تتكيف واجهة أوريليا بشكل ديناميكي مع أحجام الشاشات المختلفة.",
    phoneView: "الهاتف المحمول (375px - 480px)",
    tabletView: "التابلت / آيباد (768px - 1024px)",
    desktopView: "اللابتوب / شاشة الكمبيوتر (1024px+)",
    resetSimulation: "إعادة تعيين الإطار",
    mockMapTip: "انقر فوق أي معلَم في القاهرة أدناه لتحديد الإحداثيات فوراً:",
    navShop: "المتجر",
    navCollections: "التشكيلات",
    navSkincare: "العناية بالبشرة",
    navJournal: "المجلة",
    navAbout: "حول المعرض",
  }
};

export default function HomePage() {
  const [lang, setLang] = useState<"EN" | "AR">("EN");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Responsive design simulation settings
  const [activeViewportMode, setActiveViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [physicalWidth, setPhysicalWidth] = useState<number>(1200);

  // App Global State
  const [user, setUser] = useState<DbUser | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  
  // UI states
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "register" | "otp" | "address" }>({
    isOpen: false,
    mode: "login"
  });

  // Auth Forms
  const [loginForm, setLoginForm] = useState({ usernameOrEmail: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [otpInput, setOtpInput] = useState("");
  const [addressForm, setAddressForm] = useState({ address: "", coords: "30.0444,31.2357" });
  
  // OTP simulation storage
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);
  const [simulatedNotification, setSimulatedNotification] = useState<{ visible: boolean; phone: string; otp: string } | null>(null);

  // Admin and inline editing variables
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState({
    imageUrl: "",
    imageScale: 100,
    price: 0,
    oldPrice: "" as string | number,
    timerEndsInMinutes: "" as string | number,
  });
  
  const [adminUsersList, setAdminUsersList] = useState<DbUser[]>([]);
  const [promoteEmail, setPromoteEmail] = useState("");
  const [authError, setAuthError] = useState("");
  const [adminActionStatus, setAdminActionStatus] = useState("");
  const [countdownTicks, setCountdownTicks] = useState<{ [key: number]: string }>({});

  // Detect real physical window dimensions
  useEffect(() => {
    const handleResize = () => {
      setPhysicalWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync state with localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("aurelia_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
    
    const savedCart = localStorage.getItem("aurelia_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }

    const savedWishlist = localStorage.getItem("aurelia_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save cart & wishlist when changed
  useEffect(() => {
    localStorage.setItem("aurelia_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("aurelia_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Load products list
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProductsList(data.products);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Refresh products every 15 seconds to check countdown expiration on backend!
    const interval = setInterval(fetchProducts, 15000);
    return () => clearInterval(interval);
  }, []);

  // Load user order history & admin user list when logged in
  useEffect(() => {
    if (user) {
      // Load orders
      fetch(`/api/orders?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrdersList(data.orders);
          }
        });

      // Load all users if Admin
      if (user.role === "admin") {
        fetch("/api/admin/users")
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setAdminUsersList(data.users);
            }
          });
      }
    } else {
      setOrdersList([]);
      setAdminUsersList([]);
    }
  }, [user]);

  // Real-time Countdown Timer Calculator
  useEffect(() => {
    const calculateCountdowns = () => {
      const ticks: { [key: number]: string } = {};
      const now = Date.now();

      productsList.forEach(prod => {
        if (prod.timerEndsAt) {
          const distance = new Date(prod.timerEndsAt).getTime() - now;
          if (distance <= 0) {
            ticks[prod.id] = "Expired";
            // Trigger a silent refresh to let the backend revert the price
            fetchProducts();
          } else {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            ticks[prod.id] = `${hours}${T[lang].hours} ${minutes}${T[lang].mins} ${seconds}${T[lang].secs}`;
          }
        }
      });
      setCountdownTicks(ticks);
    };

    calculateCountdowns();
    const interval = setInterval(calculateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [productsList, lang]);

  // Localization translator helper
  const t = (key: keyof typeof T.EN) => {
    return T[lang][key] || T.EN[key] || "";
  };

  // Cart operations
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Visual feedback
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQty = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: newQty } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Cart Summary Calculator
  const cartSubtotal = cart.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  // Authentication & Verification Flows
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("aurelia_user", JSON.stringify(data.user));
        setAuthModal({ isOpen: false, mode: "login" });
        setLoginForm({ usernameOrEmail: "", password: "" });
      } else {
        setAuthError(data.error || "Login failed");
      }
    } catch (err) {
      setAuthError("An error occurred during sign in.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.phone) {
      setAuthError("Please fill out all registration fields.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      const data = await res.json();
      if (data.success) {
        setActiveOtpCode(data.otp);
        // Show our marvelous top-bar simulated WhatsApp notification
        setSimulatedNotification({
          phone: data.phone,
          otp: data.otp,
          visible: true
        });
        // Transition to OTP verification step
        setAuthModal({ isOpen: true, mode: "otp" });
      } else {
        setAuthError(data.error || "Registration failed");
      }
    } catch (err) {
      setAuthError("An error occurred during registration request.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!otpInput) {
      setAuthError("Please enter the verification code sent to your WhatsApp.");
      return;
    }

    const phoneNum = authModal.mode === "otp" ? registerForm.phone : (user?.phone || "");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: phoneNum, 
          otp: otpInput 
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Dismiss notification
        setSimulatedNotification(null);
        setOtpInput("");
        
        if (user) {
          // Phone update flow verified! Update user in client state
          const updatedUser = { ...user, phone: phoneNum, isVerified: true };
          setUser(updatedUser);
          localStorage.setItem("aurelia_user", JSON.stringify(updatedUser));
          setAuthModal({ isOpen: false, mode: "login" });
          alert(lang === "EN" ? "Phone number verified successfully!" : "تم التحقق من رقم الهاتف بنجاح!");
        } else {
          // Registration flow: proceed to Address and Location pinning
          setAuthModal({ isOpen: true, mode: "address" });
        }
      } else {
        setAuthError(data.error || "Incorrect OTP");
      }
    } catch (err) {
      setAuthError("An error occurred during OTP verification.");
    }
  };

  const handleSaveAddressAndComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!addressForm.address) {
      setAuthError("Please specify your delivery address.");
      return;
    }

    // Since we are completing registration, we need the temporary user details
    // We will call the login route with user credentials, get the user, then update address
    try {
      // First, log in with the new credentials to establish session
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          usernameOrEmail: registerForm.email, 
          password: registerForm.password 
        }),
      });
      const loginData = await loginRes.json();
      
      if (loginData.success) {
        const loggedInUser = loginData.user;
        
        // Update the delivery address and pinned coordinates
        const addrRes = await fetch("/api/auth/update-address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: loggedInUser.id,
            address: addressForm.address,
            locationCoords: addressForm.coords,
          }),
        });
        
        const addrData = await addrRes.json();
        if (addrData.success) {
          setUser(addrData.user);
          localStorage.setItem("aurelia_user", JSON.stringify(addrData.user));
          setAuthModal({ isOpen: false, mode: "login" });
          
          // Clear forms
          setRegisterForm({ name: "", email: "", password: "", phone: "" });
          setAddressForm({ address: "", coords: "30.0444,31.2357" });
          
          // If they came from cart checkout, they can proceed directly
          alert(lang === "EN" ? "Welcome to AURÉLIA! Your account is verified and ready." : "مرحباً بكم في أوريليا! حسابكم جاهز ومؤكد الآن.");
        } else {
          setAuthError(addrData.error || "Failed to save address details.");
        }
      } else {
        setAuthError("Verification successful, but failed session initiation.");
      }
    } catch (err) {
      setAuthError("An error occurred while saving delivery configurations.");
    }
  };

  const triggerPhoneUpdateFlow = async (newPhone: string) => {
    if (!user) return;
    if (!newPhone) {
      alert("Please provide a valid WhatsApp number.");
      return;
    }

    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: newPhone, userId: user.id }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveOtpCode(data.otp);
        setSimulatedNotification({
          phone: newPhone,
          otp: data.otp,
          visible: true
        });
        
        // Open OTP modal for existing user phone update
        setAuthModal({ isOpen: true, mode: "otp" });
      } else {
        alert(data.error || "Failed to send update code.");
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating phone number update verification.");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      // Force Login/Register
      setAuthModal({ isOpen: true, mode: "login" });
      return;
    }

    if (!user.isVerified) {
      // Force phone verification
      triggerPhoneUpdateFlow(user.phone || "");
      return;
    }

    // Place actual order
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: cart,
          totalPrice: cartSubtotal,
          address: user.address || "Main City Address",
          locationCoords: user.locationCoords,
        }),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        setIsCartOpen(false);
        alert(lang === "EN" 
          ? "✨ Thank you for choosing AURÉLIA Fine Jewelry! Your order has been placed successfully via Egypt Post (البريد المصري)."
          : "✨ شكراً لاختياركم مجوهرات أوريليا الفاخرة! تم تسجيل طلبكم بنجاح وسيتم الشحن من خلال البريد المصري."
        );
        // Refresh orders
        const ordersRes = await fetch(`/api/orders?userId=${user.id}`);
        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          setOrdersList(ordersData.orders);
        }
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch (err) {
      alert("Error processing checkout order.");
    }
  };

  // Sign out
  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("aurelia_user");
    setOrdersList([]);
    setAdminUsersList([]);
  };

  // Admin Actions
  const handleInlineEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setEditFields({
      imageUrl: product.imageUrl,
      imageScale: product.imageScale || 100,
      price: product.price,
      oldPrice: product.oldPrice || "",
      timerEndsInMinutes: "",
    });
  };

  const handleAdminProductSave = async (productId: number) => {
    try {
      const payload = {
        action: "update",
        id: productId,
        imageUrl: editFields.imageUrl,
        imageScale: editFields.imageScale,
        price: Number(editFields.price),
        oldPrice: editFields.oldPrice ? Number(editFields.oldPrice) : null,
        timerEndsInMinutes: editFields.timerEndsInMinutes ? Number(editFields.timerEndsInMinutes) : undefined,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setEditingProductId(null);
        fetchProducts(); // reload updated list
      } else {
        alert("Error saving: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product details.");
    }
  };

  const handleScaleSliderChange = async (productId: number, scaleVal: number) => {
    // Optimistically update the UI scale instantly!
    setProductsList(prev => prev.map(p => p.id === productId ? { ...p, imageScale: scaleVal } : p));
    
    // Send background update
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: productId,
          imageScale: scaleVal,
        }),
      });
    } catch (err) {
      console.error("Scale sync error:", err);
    }
  };

  const handlePromoteEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionStatus("");
    if (!promoteEmail) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: promoteEmail,
          makeAdmin: true
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminActionStatus(`User ${promoteEmail} has been successfully promoted to Admin!`);
        setPromoteEmail("");
        // Reload users list
        const uRes = await fetch("/api/admin/users");
        const uData = await uRes.json();
        if (uData.success) {
          setAdminUsersList(uData.users);
        }
      } else {
        setAdminActionStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      setAdminActionStatus("An error occurred during promoting.");
    }
  };

  const toggleUserAdminRole = async (targetUser: DbUser, makeAdmin: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUser.id,
          makeAdmin
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Reload users list
        const uRes = await fetch("/api/admin/users");
        const uData = await uRes.json();
        if (uData.success) {
          setAdminUsersList(uData.users);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Google Maps interactive mock coords selector
  const CairoLandmarks = [
    { name: "Zamalek, Cairo (الزمالك)", coords: "30.0596,31.2241" },
    { name: "Maadi District (المعادي)", coords: "29.9602,31.2569" },
    { name: "Heliopolis Palace (مصر الجديدة)", coords: "30.0901,31.3225" },
    { name: "Fifth Settlement, Tagamoa (التجمع الخامس)", coords: "30.0055,31.4744" },
    { name: "Egypt Post HQ, Ataba (بريد العتبة)", coords: "30.0520,31.2462" }
  ];

  return (
    <div 
      className={`min-h-screen bg-[#FAF6F0] text-[#3A3530] font-serif transition-all duration-300 ${
        lang === "AR" ? "rtl" : "ltr"
      }`}
      style={{ direction: lang === "AR" ? "rtl" : "ltr" }}
    >
      
      {/* 1. TOP MARQUEE & NOTIFICATION FOR SIMULATED WHATSAPP OTP */}
      {simulatedNotification && (
        <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 bg-white border border-[#E5D5C0] rounded-2xl shadow-2xl p-4 z-50 animate-bounce transition-all duration-500">
          <div className="flex items-start gap-3">
            <div className="bg-[#25D366] text-white p-2 rounded-full flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
                  WhatsApp OTP Simulation
                </span>
                <span className="text-[10px] text-gray-400">01159055625</span>
              </div>
              <p className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 text-xs mt-1">
                <strong>AURÉLIA Fine Jewelry:</strong> Your secure verification code is{" "}
                <span className="text-amber-700 font-extrabold text-base px-1 tracking-wider select-all">
                  {simulatedNotification.otp}
                </span>
              </p>
              <div className="mt-2 flex justify-between items-center">
                <button 
                  onClick={() => {
                    setOtpInput(simulatedNotification.otp);
                  }}
                  className="text-xs bg-[#C5A880] text-white px-2 py-1 rounded hover:bg-[#A4865E] transition-colors"
                >
                  {lang === "EN" ? "Copy OTP Code" : "نسخ الرمز تلقائياً"}
                </button>
                <button 
                  onClick={() => setSimulatedNotification(null)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LUXURY HEADER MARQUEE */}
      <div className="bg-[#3A3530] text-[#FAF6F0] text-center py-2 px-4 text-xs tracking-widest border-b border-[#E5D5C0]/20 font-sans flex justify-between items-center">
        <div className="hidden md:block">
          {lang === "EN" ? "✨ FREE EGYPT POST SHIPPING ON ORDERS OVER 15,000 EGP" : "✨ شحن مجاني عبر البريد المصري للطلبات الأكثر من ١٥,٠٠٠ جنيه"}
        </div>
        <div className="mx-auto md:mx-0 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            EGP ONLY / جنيه مصري فقط
          </span>
          {user && (
            <span className="bg-[#C5A880]/20 text-[#C5A880] px-2 py-0.5 rounded text-[10px] font-sans">
              {user.role === "admin" ? `👑 Admin: ${user.name}` : `👤 ${user.name}`}
            </span>
          )}
        </div>
      </div>

      {/* 2. REAL-TIME DESIGN ADAPTATION & DEVICE DETECTION CONTROL PANEL */}
      <div className="bg-[#F3EDE2] border-b border-[#E5D5C0] py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#C5A880]" />
                <h2 className="font-serif text-sm md:text-base font-bold tracking-widest text-[#3A3530] uppercase">
                  {t("viewportTitle")}
                </h2>
              </div>
              <p className="text-xs text-[#6E6458] mt-1 font-sans">
                {t("viewportDesc")}
              </p>
            </div>

            {/* Viewport indicators */}
            <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg border border-[#E5D5C0] shadow-sm">
              <div className="text-xs font-sans text-gray-500 px-2 border-r border-[#E5D5C0]">
                {t("activeViewport")}:{" "}
                <span className="font-bold text-[#3A3530]">
                  {activeViewportMode === "desktop" && `${t("desktopView")} - ${physicalWidth}px`}
                  {activeViewportMode === "tablet" && `${t("tabletView")} - 768px`}
                  {activeViewportMode === "mobile" && `${t("phoneView")} - 375px`}
                </span>
                <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                  <span className="w-1.5 h-1.5 mr-1 bg-green-500 rounded-full animate-pulse"></span>
                  Active
                </span>
              </div>

              {/* Simulation buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setActiveViewportMode("mobile") }}
                  className={`p-1.5 rounded transition-all flex items-center gap-1 text-xs font-sans ${
                    activeViewportMode === "mobile" 
                      ? "bg-[#C5A880] text-white font-bold" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Phone Preview Mode"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Phone</span>
                </button>
                <button
                  onClick={() => { setActiveViewportMode("tablet") }}
                  className={`p-1.5 rounded transition-all flex items-center gap-1 text-xs font-sans ${
                    activeViewportMode === "tablet" 
                      ? "bg-[#C5A880] text-white font-bold" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Tablet Preview Mode"
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tablet</span>
                </button>
                <button
                  onClick={() => { setActiveViewportMode("desktop") }}
                  className={`p-1.5 rounded transition-all flex items-center gap-1 text-xs font-sans ${
                    activeViewportMode === "desktop" 
                      ? "bg-[#C5A880] text-white font-bold" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Full Width Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIMULATED VIEWPORT CONTAINER */}
      {/* If Simulated mode is active, wrap the main page inside an elegant frame with connection lines */}
      <div className="flex justify-center bg-[#FAF6F0] py-6 px-2 md:px-6 transition-all duration-500">
        <div 
          style={{ 
            width: activeViewportMode === "mobile" ? "375px" : activeViewportMode === "tablet" ? "768px" : "100%",
            maxWidth: "100%",
          }}
          className={`transition-all duration-500 ease-in-out bg-white shadow-2xl rounded-3xl overflow-hidden border ${
            activeViewportMode !== "desktop" ? "border-4 border-[#C5A880] outline outline-offset-4 outline-[#E5D5C0]/60 ring-2 ring-[#3A3530]" : "border-[#E5D5C0]/40"
          }`}
        >
          {activeViewportMode !== "desktop" && (
            <div className="bg-[#3A3530] text-[#FAF6F0] text-center py-2 text-xs font-sans tracking-widest font-bold flex justify-between px-6">
              <span>📱 {activeViewportMode.toUpperCase()} VIEWPORT ACTIVE</span>
              <button 
                onClick={() => setActiveViewportMode("desktop")} 
                className="text-xs underline text-[#C5A880] hover:text-white"
              >
                {t("resetSimulation")}
              </button>
            </div>
          )}

          {/* MAIN STOREFRONT NAVIGATION BAR */}
          <header className="border-b border-[#E5D5C0]/50 sticky top-0 bg-white/95 backdrop-blur-md z-40">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
              
              {/* L: MENU LINKS (Hidden on phone view or collapsed) */}
              <nav className="hidden lg:flex items-center gap-6 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#6E6458]">
                <a href="#hero" className="hover:text-[#C5A880] transition-colors">{t("navShop")}</a>
                <a href="#curated" className="hover:text-[#C5A880] transition-colors">{t("navCollections")}</a>
                <a href="#bestsellers" className="hover:text-[#C5A880] transition-colors">{t("navAbout")}</a>
              </nav>

              {/* CENTER: LUXURIOUS LOGO BRANDING */}
              <div className="text-center flex-1 lg:flex-none">
                <a href="#" className="inline-block">
                  <h1 className="font-serif text-2xl md:text-3xl font-normal tracking-[0.15em] text-[#3A3530] leading-none">
                    {t("shopTitle")}
                  </h1>
                  <p className="text-[9px] tracking-[0.3em] text-[#C5A880] mt-1 uppercase">
                    {t("shopSubtitle")}
                  </p>
                </a>
              </div>

              {/* R: ACTIONS & CONTROLS */}
              <div className="flex items-center gap-3 md:gap-5">
                
                {/* 1. EN/AR LANGUAGE TOGGLE */}
                <button
                  onClick={() => setLang(prev => prev === "EN" ? "AR" : "EN")}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-[#E5D5C0] hover:border-[#C5A880] rounded-full text-[#6E6458] hover:text-[#C5A880] transition-all font-sans"
                  title="Toggle Language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span className="font-semibold">{t("toggleLang")}</span>
                </button>

                {/* 2. WISHLIST ACTION */}
                <button
                  onClick={() => setIsWishlistOpen(true)}
                  className="relative p-2 text-[#6E6458] hover:text-[#C5A880] transition-all"
                  aria-label="Wishlist"
                >
                  <Heart className="w-[19px] h-[19px]" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-[#C5A880] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* 3. CART BAG ACTION */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-[#6E6458] hover:text-[#C5A880] transition-all"
                  aria-label="Shopping Bag"
                >
                  <ShoppingBag className="w-[19px] h-[19px]" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-[#3A3530] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {cart.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  )}
                </button>

                {/* 4. USER ACCESS BUTTON */}
                <button
                  onClick={() => {
                    if (user) {
                      // Scroll to user profile details
                      const element = document.getElementById("user-profile-section");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      } else {
                        setAuthModal({ isOpen: true, mode: "login" });
                      }
                    } else {
                      setAuthModal({ isOpen: true, mode: "login" });
                    }
                  }}
                  className={`flex items-center gap-1 p-2 rounded-full border transition-all ${
                    user 
                      ? "border-green-300 bg-green-50/50 text-[#3A3530] hover:border-[#C5A880]" 
                      : "border-transparent hover:border-[#E5D5C0] text-[#6E6458]"
                  }`}
                  title="Profile Account"
                >
                  <User className="w-[19px] h-[19px]" />
                  {user && (
                    <span className="hidden sm:inline text-[10px] font-sans font-bold max-w-[80px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  )}
                </button>

              </div>
            </div>
          </header>

          {/* 3. HERO BANNER - RADIANCE REDEFINED STYLE */}
          <section id="hero" className="relative h-[480px] bg-slate-900 overflow-hidden flex items-center justify-center">
            {/* Soft Cream Draped Fabric background image */}
            <div className="absolute inset-0 z-0 scale-105 transform hover:scale-100 transition-transform duration-[4000ms]">
              <img 
                src="https://images.pexels.com/photos/8465944/pexels-photo-8465944.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" 
                alt="Cream luxury silk background waves"
                className="w-full h-full object-cover opacity-85 saturate-[0.8]"
              />
              {/* Gold/beige silk lighting gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0]/95 via-[#FAF6F0]/40 to-transparent"></div>
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#FAF6F0]/20 to-[#3A3530]/10"></div>
            </div>

            {/* Content box */}
            <div className="relative z-10 text-center px-4 max-w-2xl">
              <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C5A880] font-sans font-extrabold block mb-3">
                {lang === "EN" ? "AURÉLIA MAISON" : "أوريليا ميزون"}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-light tracking-[0.1em] text-[#3A3530] leading-tight uppercase animate-fade-in">
                {t("heroTitle")}
              </h2>
              <div className="w-16 h-[1.5px] bg-[#C5A880] mx-auto my-5"></div>
              <p className="text-xs md:text-base text-[#6E6458] font-serif font-light leading-relaxed max-w-lg mx-auto">
                {t("heroSub")}
              </p>
              <div className="mt-8">
                <a 
                  href="#bestsellers" 
                  className="inline-block bg-[#3A3530] text-[#FAF6F0] text-xs font-semibold tracking-[0.2em] px-8 py-4 border border-[#3A3530] hover:bg-transparent hover:text-[#3A3530] rounded-none transition-all duration-300"
                >
                  {t("shopNew")}
                </a>
              </div>
            </div>
          </section>

          {/* 4. CURATED CATEGORIES SECTION */}
          <section id="curated" className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="font-serif text-2xl font-light tracking-[0.15em] text-[#3A3530] uppercase">
                {t("curated")}
              </h3>
              <div className="w-12 h-[1px] bg-[#C5A880] mx-auto mt-3"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              
              {/* Category 1: Rings */}
              <div className="group relative bg-[#FDFBF7] border border-[#E5D5C0]/40 overflow-hidden shadow-sm p-4 text-center transition-all duration-500 hover:shadow-md">
                <div className="h-64 overflow-hidden bg-[#FAF6F0] mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80" 
                    alt="Diamond Solitaires Category"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h4 className="font-serif text-sm tracking-[0.15em] font-normal uppercase text-[#3A3530] mb-1">
                  {lang === "EN" ? "DIAMOND RINGS" : "خواتم الألماس"}
                </h4>
                <p className="text-[10px] tracking-[0.1em] text-[#C5A880] uppercase mb-3">
                  {t("timelessElegance")}
                </p>
                <a href="#bestsellers" className="text-xs font-semibold tracking-[0.15em] uppercase text-[#3A3530] inline-flex items-center gap-1 hover:text-[#C5A880] transition-colors">
                  {t("shopNow")} <ChevronRight className="w-3 h-3" />
                </a>
              </div>

              {/* Category 2: Necklaces */}
              <div className="group relative bg-[#FDFBF7] border border-[#E5D5C0]/40 overflow-hidden shadow-sm p-4 text-center transition-all duration-500 hover:shadow-md">
                <div className="h-64 overflow-hidden bg-[#FAF6F0] mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80" 
                    alt="Gold Necklaces Category"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h4 className="font-serif text-sm tracking-[0.15em] font-normal uppercase text-[#3A3530] mb-1">
                  {lang === "EN" ? "FINE NECKLACES" : "القلائد الفاخرة"}
                </h4>
                <p className="text-[10px] tracking-[0.1em] text-[#C5A880] uppercase mb-3">
                  {lang === "EN" ? "ROYAL DESIGNS" : "تصاميم ملكية"}
                </p>
                <a href="#bestsellers" className="text-xs font-semibold tracking-[0.15em] uppercase text-[#3A3530] inline-flex items-center gap-1 hover:text-[#C5A880] transition-colors">
                  {t("shopNow")} <ChevronRight className="w-3 h-3" />
                </a>
              </div>

              {/* Category 3: Pearl Treasures */}
              <div className="group relative bg-[#FDFBF7] border border-[#E5D5C0]/40 overflow-hidden shadow-sm p-4 text-center transition-all duration-500 hover:shadow-md">
                <div className="h-64 overflow-hidden bg-[#FAF6F0] mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" 
                    alt="Pearl Earrings Category"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h4 className="font-serif text-sm tracking-[0.15em] font-normal uppercase text-[#3A3530] mb-1">
                  {lang === "EN" ? "PEARL EARRINGS" : "أقراط اللؤلؤ"}
                </h4>
                <p className="text-[10px] tracking-[0.1em] text-[#C5A880] uppercase mb-3">
                  {lang === "EN" ? "PURE RADIANCE" : "إشراق نقي الخلاص"}
                </p>
                <a href="#bestsellers" className="text-xs font-semibold tracking-[0.15em] uppercase text-[#3A3530] inline-flex items-center gap-1 hover:text-[#C5A880] transition-colors">
                  {t("shopNow")} <ChevronRight className="w-3 h-3" />
                </a>
              </div>

            </div>
          </section>

          {/* 5. BESTSELLERS & MAIN PRODUCT LIST */}
          <section id="bestsellers" className="py-16 px-4 md:px-8 bg-[#FDFBF7] border-t border-[#E5D5C0]/30">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-12">
                <span className="text-[10px] tracking-[0.3em] text-[#C5A880] font-sans font-extrabold uppercase block mb-1">
                  {lang === "EN" ? "CRAFTED EXCLUSIVITY" : "صياغة حصرية فائقة"}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-light tracking-[0.15em] text-[#3A3530] uppercase">
                  {t("bestsellers")}
                </h3>
                <p className="text-xs text-[#6E6458] mt-2 font-serif font-light max-w-md mx-auto">
                  {t("bestsellersSub")}
                </p>
                <div className="w-12 h-[1px] bg-[#C5A880] mx-auto mt-4"></div>
              </div>

              {/* Loading Skeleton */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="bg-white p-6 rounded border border-gray-100 animate-pulse text-center">
                      <div className="h-64 bg-gray-100 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {productsList.map((product) => {
                    const hasTimer = product.timerEndsAt !== null;
                    const isEditing = editingProductId === product.id;
                    const isLoved = wishlist.includes(product.id);

                    return (
                      <div 
                        key={product.id}
                        className={`group relative bg-white border border-[#E5D5C0]/40 p-4 rounded-xl flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_24px_rgba(197,168,128,0.1)]`}
                      >
                        
                        {/* Love Icon (Wishlist) Button */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-6 right-6 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm hover:scale-110 transition-all text-[#6E6458] hover:text-red-500"
                        >
                          <Heart 
                            className={`w-4.5 h-4.5 transition-colors ${
                              isLoved ? "fill-red-500 text-red-500" : "text-gray-400"
                            }`} 
                          />
                        </button>

                        {/* Image block (With Admin Scale factor applied) */}
                        <div className="h-72 overflow-hidden bg-[#FAF6F0] relative flex items-center justify-center rounded-lg mb-4">
                          <img 
                            src={product.imageUrl} 
                            alt={lang === "EN" ? product.nameEn : product.nameAr}
                            className="transition-transform duration-500 object-contain max-h-full"
                            style={{ 
                              transform: `scale(${(product.imageScale || 100) / 100})`,
                            }}
                          />

                          {/* Pulsing Active Timer Display on card */}
                          {hasTimer && countdownTicks[product.id] && countdownTicks[product.id] !== "Expired" && (
                            <div className="absolute bottom-3 left-3 bg-red-900/90 text-white py-1 px-3 rounded-full text-[10px] font-sans font-bold flex items-center gap-1.5 shadow-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                              <span className="uppercase tracking-widest text-[9px] mr-1">{t("timerEnds")}</span>
                              <span>{countdownTicks[product.id]}</span>
                            </div>
                          )}
                        </div>

                        {/* Product Meta */}
                        <div className="text-center flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-center gap-0.5 mb-2">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                              ))}
                            </div>

                            {/* Localized Title */}
                            <h4 className="font-serif text-base tracking-[0.05em] font-medium text-[#3A3530] mb-1">
                              {lang === "EN" ? product.nameEn : product.nameAr}
                            </h4>

                            {/* Localized Description */}
                            <p className="text-[11px] text-[#6E6458] font-light leading-relaxed mb-4 max-w-xs mx-auto line-clamp-2">
                              {lang === "EN" ? product.descriptionEn : product.descriptionAr}
                            </p>
                          </div>

                          <div>
                            {/* Price Presentation (exclusively in EGP / جنيه) */}
                            <div className="flex justify-center items-center gap-2 mb-4">
                              {product.oldPrice ? (
                                <>
                                  <span className="text-xs text-gray-400 line-through font-sans">
                                    {product.oldPrice.toLocaleString()} {t("egp")}
                                  </span>
                                  <span className="text-base text-red-700 font-semibold font-sans font-extrabold">
                                    {product.price.toLocaleString()} {t("egp")}
                                  </span>
                                </>
                              ) : (
                                <span className="text-base text-[#3A3530] font-semibold font-sans font-extrabold">
                                  {product.price.toLocaleString()} {t("egp")}
                                </span>
                              )}
                            </div>

                            {/* ADD TO BAG BUTTON */}
                            <button
                              onClick={() => addToCart(product)}
                              className="w-full bg-[#3A3530] text-[#FAF6F0] text-[10px] tracking-[0.2em] uppercase font-bold py-3 hover:bg-[#C5A880] hover:text-white transition-colors duration-300 rounded-none mb-2 flex items-center justify-center gap-2"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              {t("addToCart")}
                            </button>
                          </div>
                        </div>

                        {/* 6. HIDDEN ADMIN STOREFRONT INLINE CONTROLS */}
                        {user && user.role === "admin" && (
                          <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
                            <div className="flex justify-between items-center font-bold text-[#3A3530] mb-2 border-b border-amber-200 pb-1">
                              <span>⚙️ Inline Admin Tools</span>
                              <button 
                                onClick={() => {
                                  if (isEditing) setEditingProductId(null);
                                  else handleInlineEditClick(product);
                                }}
                                className="text-xs text-amber-700 underline"
                              >
                                {isEditing ? "Close" : "Edit Item"}
                              </button>
                            </div>

                            {/* Inline quick image drag-to-resize simulation */}
                            <div className="mb-2">
                              <label className="block text-[10px] font-sans text-amber-800 font-bold mb-1">
                                {t("scaleLabel")}: <span className="text-amber-900">{product.imageScale || 100}%</span>
                              </label>
                              <input 
                                type="range" 
                                min="50" 
                                max="150" 
                                value={product.imageScale || 100} 
                                onChange={(e) => handleScaleSliderChange(product.id, Number(e.target.value))}
                                className="w-full accent-amber-700 cursor-ew-resize"
                              />
                              <div className="flex justify-between text-[8px] text-amber-600 font-sans">
                                <span>Scale: 50%</span>
                                <span>Scale: 150%</span>
                              </div>
                            </div>

                            {isEditing && (
                              <div className="space-y-2 mt-2 pt-2 border-t border-amber-200">
                                <div>
                                  <label className="block text-[9px] text-[#3A3530] font-sans">{t("gdLabel")}</label>
                                  <input 
                                    type="text" 
                                    value={editFields.imageUrl}
                                    onChange={(e) => setEditFields(prev => ({ ...prev, imageUrl: e.target.value }))}
                                    placeholder="Enter Google Drive link or image URL"
                                    className="w-full p-1 border border-amber-300 rounded bg-white text-xs font-sans"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[9px] text-[#3A3530] font-sans">{t("priceLabel")}</label>
                                    <input 
                                      type="number" 
                                      value={editFields.price}
                                      onChange={(e) => setEditFields(prev => ({ ...prev, price: Number(e.target.value) }))}
                                      className="w-full p-1 border border-amber-300 rounded bg-white text-xs font-sans"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] text-[#3A3530] font-sans">{t("oldPriceLabel")}</label>
                                    <input 
                                      type="number" 
                                      value={editFields.oldPrice}
                                      onChange={(e) => setEditFields(prev => ({ ...prev, oldPrice: e.target.value }))}
                                      placeholder="No discount"
                                      className="w-full p-1 border border-amber-300 rounded bg-white text-xs font-sans"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[9px] text-[#3A3530] font-sans">{t("timerLabel")}</label>
                                  <input 
                                    type="number" 
                                    value={editFields.timerEndsInMinutes}
                                    onChange={(e) => setEditFields(prev => ({ ...prev, timerEndsInMinutes: e.target.value }))}
                                    placeholder="Minutes from now (e.g., 60)"
                                    className="w-full p-1 border border-amber-300 rounded bg-white text-xs font-sans"
                                  />
                                </div>

                                <button
                                  onClick={() => handleAdminProductSave(product.id)}
                                  className="w-full bg-amber-700 text-white p-1.5 rounded text-xs hover:bg-amber-800 transition-colors font-bold uppercase tracking-wider"
                                >
                                  {t("saveProductBtn")}
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </section>

          {/* 7. SECURE CHECKOUT ADDRESS FORM & LOCATION PINNER */}
          {/* (Forces authentication first via standard Cart logic) */}

          {/* 8. USER ACCOUNT PROFILE DASHBOARD & ORDER ARCHIVE */}
          <section id="user-profile-section" className="py-16 px-4 md:px-8 bg-[#F6EFE5] border-t border-[#E5D5C0]/50">
            <div className="max-w-4xl mx-auto">
              
              {!user ? (
                <div className="bg-white/80 backdrop-blur border border-[#E5D5C0] rounded-2xl p-8 text-center shadow-sm">
                  <Lock className="w-10 h-10 text-[#C5A880] mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-normal text-[#3A3530] uppercase">
                    {lang === "EN" ? "Sign In For Order History" : "سجل دخولك لمتابعة طلباتك"}
                  </h3>
                  <p className="text-xs text-[#6E6458] mt-2 mb-6 font-serif font-light">
                    {lang === "EN" ? "Access your personal workspace, check historical fine jewelry orders, and change shipping address specifications." : "قم بالوصول لمساحتك الخاصة، ومتابعة تاريخ طلبات مجوهراتك وتعديل بيانات الشحن."}
                  </p>
                  <button 
                    onClick={() => setAuthModal({ isOpen: true, mode: "login" })}
                    className="bg-[#3A3530] text-white text-xs font-bold tracking-widest px-8 py-3.5 hover:bg-[#C5A880] transition-colors"
                  >
                    {lang === "EN" ? "Login to Profile" : "تسجيل الدخول للملف الشخصي"}
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  
                  {/* Top Profile Card */}
                  <div className="bg-white border border-[#E5D5C0] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <span className="text-[10px] tracking-widest font-sans font-bold bg-[#C5A880]/10 text-[#C5A880] px-2.5 py-1 rounded-full uppercase">
                        {user.role === "admin" ? t("adminBadge") : "AURELIA COLLECTOR"}
                      </span>
                      <h3 className="font-serif text-2xl text-[#3A3530] mt-2 font-normal">
                        {t("welcome")} {user.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-sans">{user.email}</p>
                      
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-sans text-[#6E6458]">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-[#C5A880]" />
                          <span>{user.phone || "No phone linked"}</span>
                          {user.isVerified ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-green-100 text-green-800 px-1.5 py-0.2 rounded">
                              <Check className="w-2.5 h-2.5" /> {t("verifiedBadge")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded animate-pulse">
                              <AlertCircle className="w-2.5 h-2.5" /> {t("unverifiedBadge")}
                            </span>
                          )}
                        </span>
                        
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#C5A880]" />
                          <span className="truncate max-w-[200px]">{user.address || "No address saved"}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => {
                          // Prefill forms for address editing
                          setAddressForm({
                            address: user.address || "",
                            coords: user.locationCoords || "30.0444,31.2357"
                          });
                          setAuthModal({ isOpen: true, mode: "address" });
                        }}
                        className="flex-1 md:flex-none border border-[#E5D5C0] text-[#3A3530] hover:text-[#C5A880] hover:border-[#C5A880] text-xs font-bold tracking-wider px-4 py-2.5 rounded transition-all font-sans text-center"
                      >
                        {lang === "EN" ? "Edit Address/Map" : "تعديل العنوان والخريطة"}
                      </button>
                      <button 
                        onClick={handleSignOut}
                        className="flex-1 md:flex-none bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold tracking-wider px-4 py-2.5 rounded transition-all font-sans text-center"
                      >
                        {t("logoutBtn")}
                      </button>
                    </div>
                  </div>

                  {/* Address and Phone trigger dynamic OTP Verification */}
                  <div className="bg-white border border-[#E5D5C0] rounded-2xl p-6 shadow-sm">
                    <h4 className="font-serif text-sm uppercase tracking-wider text-[#3A3530] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#C5A880]" />
                      {lang === "EN" ? "Update Verification Phone Number" : "تحديث رقم الهاتف المسجل"}
                    </h4>
                    <p className="text-xs text-[#6E6458] mb-4 font-serif">
                      {lang === "EN" 
                        ? "Changing your phone number requires instant WhatsApp OTP verification to maintain your premium account status secure." 
                        : "تغيير رقم الهاتف يتطلب تأكيداً فورياً عبر رمز OTP المرسل للواتساب لضمان أمان حسابكم."}
                    </p>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const data = new FormData(e.currentTarget);
                        const phoneInput = data.get("profile_phone") as string;
                        triggerPhoneUpdateFlow(phoneInput);
                      }}
                      className="flex flex-col sm:flex-row gap-3 max-w-md"
                    >
                      <input 
                        type="text" 
                        name="profile_phone"
                        defaultValue={user.phone || ""}
                        placeholder="e.g. 01159055625"
                        className="flex-1 p-2.5 border border-[#E5D5C0] text-xs font-sans rounded"
                        required
                      />
                      <button 
                        type="submit"
                        className="bg-[#3A3530] text-white text-xs font-bold tracking-wider px-6 py-2.5 hover:bg-[#C5A880] transition-colors"
                      >
                        {lang === "EN" ? "Verify & Save Phone" : "تحقق واحفظ الرقم"}
                      </button>
                    </form>
                  </div>

                  {/* Order History */}
                  <div className="bg-white border border-[#E5D5C0] rounded-2xl p-6 md:p-8 shadow-sm">
                    <h4 className="font-serif text-lg text-[#3A3530] tracking-wider mb-6 pb-2 border-b border-[#E5D5C0]/40 uppercase">
                      {t("ordersTitle")}
                    </h4>

                    {ordersList.length === 0 ? (
                      <p className="text-xs text-gray-500 font-serif italic py-6 text-center">
                        {t("noOrders")}
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {ordersList.map((order) => {
                          let parsedItems: any[] = [];
                          try {
                            parsedItems = JSON.parse(order.items);
                          } catch (e) {
                            parsedItems = [];
                          }

                          return (
                            <div key={order.id} className="border border-[#E5D5C0]/50 rounded-xl p-4 md:p-6 bg-[#FAF6F0]/30 space-y-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
                                <div>
                                  <span className="font-bold text-xs font-sans text-gray-800">
                                    {t("orderId")}{order.id}
                                  </span>
                                  <span className="text-[10px] text-gray-400 block sm:inline sm:ml-2 font-sans">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-[10px] font-sans bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold border border-amber-200">
                                    {t("orderStatus")}: {order.status}
                                  </span>
                                  <span className="text-[10px] font-sans bg-gray-50 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                                    {t("orderAgent")}: {order.shippingAgent}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {parsedItems.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs font-sans text-gray-700">
                                    <span className="flex-1 truncate max-w-md">
                                      {lang === "EN" ? item.product.nameEn : item.product.nameAr} x{item.quantity}
                                    </span>
                                    <span className="font-bold">
                                      {(item.product.price * item.quantity).toLocaleString()} {t("egp")}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs font-sans">
                                <span className="text-gray-500 font-bold">{t("orderTotal")}:</span>
                                <span className="text-base text-amber-800 font-extrabold">
                                  {order.totalPrice.toLocaleString()} {t("egp")}
                                </span>
                              </div>

                              <div className="text-[10px] text-gray-400 font-sans flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                                <span className="truncate">{order.address}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 9. ADMIN SYSTEM: PRIVILEGE GRANTER FOR OTHER USERS */}
                  {user.role === "admin" && (
                    <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 md:p-8 shadow-md">
                      <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="w-6 h-6 text-amber-700" />
                        <h4 className="font-serif text-lg text-amber-900 tracking-wider uppercase font-bold">
                          {t("adminTitle")}
                        </h4>
                      </div>

                      <div className="space-y-6">
                        
                        {/* Promote form */}
                        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                          <h5 className="text-xs font-bold text-[#3A3530] uppercase mb-2">
                            {t("promoteUser")}
                          </h5>
                          <form onSubmit={handlePromoteEmailSubmit} className="flex flex-col sm:flex-row gap-2">
                            <input 
                              type="email" 
                              value={promoteEmail}
                              onChange={(e) => setPromoteEmail(e.target.value)}
                              placeholder="Type user's exact registered email..."
                              className="flex-1 p-2 border border-amber-300 rounded text-xs font-sans bg-white"
                              required
                            />
                            <button 
                              type="submit"
                              className="bg-amber-800 text-white text-xs px-6 py-2 rounded hover:bg-amber-900 transition-colors font-bold uppercase tracking-wider"
                            >
                              {lang === "EN" ? "Grant Admin" : "منح الإشراف"}
                            </button>
                          </form>
                          {adminActionStatus && (
                            <p className="text-[11px] text-amber-800 font-sans mt-2 font-semibold">
                              {adminActionStatus}
                            </p>
                          )}
                        </div>

                        {/* Store User Directory */}
                        <div>
                          <h5 className="text-xs font-bold text-[#3A3530] uppercase mb-3">
                            {t("userManagement")}
                          </h5>
                          
                          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <div className="max-h-60 overflow-y-auto">
                              <table className="w-full text-left text-xs font-sans">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-[9px] tracking-wider border-b border-gray-200 sticky top-0">
                                  <tr>
                                    <th className="py-2 px-3">Name</th>
                                    <th className="py-2 px-3">Email</th>
                                    <th className="py-2 px-3">Role</th>
                                    <th className="py-2 px-3 text-center">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {adminUsersList.map((uItem) => (
                                    <tr key={uItem.id} className="hover:bg-gray-50">
                                      <td className="py-2.5 px-3 font-semibold text-gray-800">{uItem.name}</td>
                                      <td className="py-2.5 px-3 text-gray-500">{uItem.email || "No email"}</td>
                                      <td className="py-2.5 px-3">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                          uItem.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"
                                        }`}>
                                          {uItem.role}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 text-center">
                                        {uItem.id === user.id ? (
                                          <span className="text-[9px] text-gray-400 italic">Self</span>
                                        ) : (
                                          <button
                                            onClick={() => toggleUserAdminRole(uItem, uItem.role !== "admin")}
                                            className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${
                                              uItem.role === "admin" 
                                                ? "bg-red-50 text-red-700 hover:bg-red-100" 
                                                : "bg-[#C5A880]/10 text-[#C5A880] hover:bg-[#C5A880] hover:text-white"
                                            }`}
                                          >
                                            {uItem.role === "admin" ? t("revokeAdminBtn") : t("makeAdminBtn")}
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </section>

          {/* FOOTER */}
          <footer className="bg-[#3A3530] text-[#FAF6F0] py-16 px-4 md:px-8 border-t border-[#E5D5C0]/20 text-xs font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="space-y-4">
                <h5 className="font-serif text-base tracking-[0.15em] text-white">AURÉLIA</h5>
                <p className="text-gray-400 font-light leading-relaxed">
                  {lang === "EN" 
                    ? "Premium handmade fine jewelry. Exquisite diamonds, pearls, and gold carefully tailored for true luxury enthusiasts." 
                    : "صياغة فائقة للمجوهرات الفاخرة يدوياً. ألماس طبيعي، لآلئ بحرية، وذهب مصاغ خصيصاً لعشاق التميز."}
                </p>
              </div>

              <div>
                <h6 className="font-bold tracking-widest text-amber-400 uppercase mb-4">Stay Connected</h6>
                <p className="text-gray-400 font-light mb-3">Stay Current Garamond, Cormorant & Poppins.</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    className="bg-white/10 text-xs text-white p-2 flex-1 rounded border border-gray-600 focus:outline-none"
                  />
                  <button className="bg-[#C5A880] text-white p-2 hover:bg-[#A4865E] transition-colors">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h6 className="font-bold tracking-widest text-amber-400 uppercase mb-4">Customer Care</h6>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-[#C5A880]">Cormorant Garamond</a></li>
                  <li><a href="#" className="hover:text-[#C5A880]">Poppins Font Pairing</a></li>
                  <li><a href="#" className="hover:text-[#C5A880]">Shipping Policies</a></li>
                  <li><a href="#" className="hover:text-[#C5A880]">Egypt Post Tracking</a></li>
                </ul>
              </div>

              <div>
                <h6 className="font-bold tracking-widest text-amber-400 uppercase mb-4">Policies</h6>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-[#C5A880]">Privacy Statement</a></li>
                  <li><a href="#" className="hover:text-[#C5A880]">Exchange & Returns</a></li>
                  <li><a href="#" className="hover:text-[#C5A880]">Terms of Luxury Service</a></li>
                  <li><a href="#" className="hover:text-[#C5A880]">EGP Currency Enforcement</a></li>
                </ul>
              </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-400 gap-4">
              <div>
                © 2026 AURÉLIA Fine Jewelry. All rights reserved. Registered under Egypt Commerce laws.
              </div>
              <div className="flex gap-4">
                <span>Shipping via: <strong>Egypt Post (البريد المصري)</strong></span>
                <span>•</span>
                <span>Active Office: Mohamed Nasser</span>
              </div>
            </div>
          </footer>

        </div>
      </div>

      {/* ========================================= */}
      {/* 10. OVERLAY SYSTEM DRAWERS & MODALS */}
      {/* ========================================= */}

      {/* A. AUTHENTICATION & REGISTRATION MODAL */}
      {authModal.isOpen && (
        <div className="fixed inset-0 bg-[#3A3530]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] border-2 border-[#E5D5C0] max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden animate-fade-in relative">
            
            {/* Close button */}
            <button 
              onClick={() => {
                setAuthModal(prev => ({ ...prev, isOpen: false }));
                setAuthError("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              
              {/* LOGIN STATE */}
              {authModal.mode === "login" && (
                <div>
                  <div className="text-center mb-6">
                    <Lock className="w-8 h-8 text-[#C5A880] mx-auto mb-2" />
                    <h3 className="font-serif text-xl font-normal text-[#3A3530] uppercase">
                      {t("loginTitle")}
                    </h3>
                    <p className="text-[11px] text-[#6E6458] mt-1 font-sans">
                      Enter your name or email. Admin can use: <strong>Mohamed Nasser</strong> / <strong>Mohamed59*</strong>
                    </p>
                  </div>

                  {authError && (
                    <div className="bg-red-50 text-red-700 text-xs p-3 rounded mb-4 font-sans flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === "EN" ? "Username or Email" : "البريد الإلكتروني أو اسم المستخدم"}
                      </label>
                      <input 
                        type="text" 
                        value={loginForm.usernameOrEmail}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, usernameOrEmail: e.target.value }))}
                        placeholder="e.g. Mohamed Nasser"
                        className="w-full p-3 border border-[#E5D5C0] bg-white rounded text-xs focus:ring-1 focus:ring-[#C5A880] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {t("passwordLabel")}
                      </label>
                      <input 
                        type="password" 
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full p-3 border border-[#E5D5C0] bg-white rounded text-xs focus:ring-1 focus:ring-[#C5A880] outline-none"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#3A3530] text-[#FAF6F0] font-bold uppercase tracking-widest py-3 hover:bg-[#C5A880] transition-colors"
                    >
                      {t("loginBtn")}
                    </button>
                  </form>

                  <div className="mt-6 text-center border-t border-[#E5D5C0]/40 pt-4">
                    <button 
                      onClick={() => {
                        setAuthModal({ isOpen: true, mode: "register" });
                        setAuthError("");
                      }}
                      className="text-xs text-amber-800 underline hover:text-[#C5A880] font-sans"
                    >
                      {t("orRegister")}
                    </button>
                  </div>
                </div>
              )}

              {/* REGISTER STATE */}
              {authModal.mode === "register" && (
                <div>
                  <div className="text-center mb-6">
                    <User className="w-8 h-8 text-[#C5A880] mx-auto mb-2" />
                    <h3 className="font-serif text-xl font-normal text-[#3A3530] uppercase">
                      {t("registerTitle")}
                    </h3>
                    <p className="text-[11px] text-[#6E6458] mt-1 font-sans">
                      Requires phone verification via simulated WhatsApp OTP dispatch.
                    </p>
                  </div>

                  {authError && (
                    <div className="bg-red-50 text-red-700 text-xs p-3 rounded mb-4 font-sans flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-3 font-sans text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{t("nameLabel")}</label>
                      <input 
                        type="text" 
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        className="w-full p-2.5 border border-[#E5D5C0] bg-white rounded text-xs focus:ring-1 focus:ring-[#C5A880]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{t("emailLabel")}</label>
                      <input 
                        type="email" 
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. client@domain.com"
                        className="w-full p-2.5 border border-[#E5D5C0] bg-white rounded text-xs focus:ring-1 focus:ring-[#C5A880]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{t("passwordLabel")}</label>
                      <input 
                        type="password" 
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Create strong password"
                        className="w-full p-2.5 border border-[#E5D5C0] bg-white rounded text-xs focus:ring-1 focus:ring-[#C5A880]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {t("phoneLabel")}
                      </label>
                      <input 
                        type="text" 
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="WhatsApp number e.g. 01159055625"
                        className="w-full p-2.5 border border-[#E5D5C0] bg-white rounded text-xs focus:ring-1 focus:ring-[#C5A880]"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#3A3530] text-[#FAF6F0] font-bold uppercase tracking-widest py-3 hover:bg-[#C5A880] transition-colors mt-2"
                    >
                      {t("registerBtn")}
                    </button>
                  </form>

                  <div className="mt-4 text-center border-t border-[#E5D5C0]/40 pt-3">
                    <button 
                      onClick={() => {
                        setAuthModal({ isOpen: true, mode: "login" });
                        setAuthError("");
                      }}
                      className="text-xs text-amber-800 underline hover:text-[#C5A880] font-sans"
                    >
                      {t("orLogin")}
                    </button>
                  </div>
                </div>
              )}

              {/* OTP STATE */}
              {authModal.mode === "otp" && (
                <div>
                  <div className="text-center mb-6">
                    <Smartphone className="w-8 h-8 text-[#C5A880] mx-auto mb-2" />
                    <h3 className="font-serif text-xl font-normal text-[#3A3530] uppercase">
                      {t("otpTitle")}
                    </h3>
                    <p className="text-[11px] text-[#6E6458] mt-1 font-sans">
                      {t("otpSubtitle")}
                    </p>
                  </div>

                  {authError && (
                    <div className="bg-red-50 text-red-700 text-xs p-3 rounded mb-4 font-sans flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-4 font-sans text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        OTP Code (sent from 01159055625)
                      </label>
                      <input 
                        type="text" 
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full p-3 border border-[#E5D5C0] bg-white rounded text-center tracking-[0.4em] font-bold text-base focus:ring-1 focus:ring-[#C5A880] outline-none"
                        required
                        maxLength={6}
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#3A3530] text-[#FAF6F0] font-bold uppercase tracking-widest py-3 hover:bg-[#C5A880] transition-colors"
                    >
                      {t("verifyBtn")}
                    </button>
                  </form>

                  <div className="mt-4 text-center text-xs text-gray-400">
                    {lang === "EN" 
                      ? "Check the on-screen simulated notification on top for your OTP code." 
                      : "يرجى التحقق من الرسالة التي تظهر في أعلى الشاشة لنسخ الرمز المسل."}
                  </div>
                </div>
              )}

              {/* ADDRESS & MAP STATE */}
              {authModal.mode === "address" && (
                <div>
                  <div className="text-center mb-4">
                    <MapPin className="w-8 h-8 text-[#C5A880] mx-auto mb-2" />
                    <h3 className="font-serif text-xl font-normal text-[#3A3530] uppercase">
                      {t("addressTitle")}
                    </h3>
                  </div>

                  {authError && (
                    <div className="bg-red-50 text-red-700 text-xs p-3 rounded mb-4 font-sans flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveAddressAndComplete} className="space-y-4 font-sans text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === "EN" ? "Manual Shipping Address" : "عنوان الشحن يدوياً"}
                      </label>
                      <textarea 
                        value={addressForm.address}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder={t("addressPlaceholder")}
                        className="w-full p-2.5 border border-[#E5D5C0] bg-white rounded text-xs h-20 focus:ring-1 focus:ring-[#C5A880] outline-none resize-none"
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {t("pinLocation")}
                      </label>
                      <p className="text-[10px] text-gray-500 mb-2">
                        {t("pinLocationSub")}
                      </p>

                      {/* Mock Interactive Map coordinates display */}
                      <div className="bg-gray-100 rounded-lg border border-[#E5D5C0] p-3 mb-2 space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="font-semibold">Interactive GPS Coordinates:</span>
                          <span className="text-amber-800 font-bold">{addressForm.coords}</span>
                        </div>
                        <div className="h-28 bg-[#EFECE5] rounded border border-[#E5D5C0] relative overflow-hidden flex flex-col justify-between p-2">
                          {/* Animated radar lines */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(197,168,128,0.15))]"></div>
                          
                          <div className="text-[9px] text-[#6E6458] z-10 font-bold">
                            🌐 MOCKED GOOGLE MAPS EMBED - CAIRO METROPOLITAN
                          </div>
                          
                          <div className="flex justify-center items-center h-full z-10">
                            <div className="flex flex-col items-center">
                              <MapPin className="w-6 h-6 text-red-600 animate-bounce" />
                              <span className="bg-amber-900 text-[#FAF6F0] text-[8px] px-1 py-0.2 rounded font-bold">
                                {addressForm.coords}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cairo quick pin selector buttons */}
                      <div className="text-[10px] text-gray-500 italic mb-2">
                        {t("mockMapTip")}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {CairoLandmarks.map((landmark, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setAddressForm(prev => ({ 
                                ...prev, 
                                coords: landmark.coords,
                                address: prev.address ? prev.address + `, ${landmark.name}` : landmark.name
                              }));
                            }}
                            className="bg-white hover:bg-[#C5A880]/10 border border-[#E5D5C0] text-[10px] px-2 py-1 rounded transition-colors text-left truncate max-w-full"
                          >
                            📍 {landmark.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* PROMINENT EGYPT POST SHIPPING NOTICE */}
                    <div className="bg-amber-50 border-l-4 border-amber-600 p-3 rounded text-amber-950">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-xs uppercase tracking-wider font-bold">
                            {t("shippingNotice")}
                          </strong>
                          <span className="text-[10px] leading-relaxed block text-gray-700 mt-1">
                            {lang === "EN" 
                              ? "Delivery is processed securely via official Egypt Post. Tracking links are provided via WhatsApp once dispatch is verified." 
                              : "يتم معالجة الشحن وتأمين المحتويات بالكامل من خلال البريد المصري السيادي والوصول في غضون ٢-٣ أيام عمل."}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#3A3530] text-[#FAF6F0] font-bold uppercase tracking-widest py-3 hover:bg-[#C5A880] transition-colors"
                    >
                      {t("saveAddressBtn")}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* B. WISHLIST SIDE DRAWER */}
      {isWishlistOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-[#FAF6F0] w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[#E5D5C0]/50 mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#C5A880] fill-[#C5A880]" />
                  <h3 className="font-serif text-lg tracking-wider text-[#3A3530] uppercase">
                    {t("wishlistTitle")}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 text-gray-500 font-serif italic">
                  {t("emptyWishlist")}
                </div>
              ) : (
                <div className="space-y-4">
                  {productsList
                    .filter(p => wishlist.includes(p.id))
                    .map(product => (
                      <div key={product.id} className="flex gap-4 bg-white p-3 border border-[#E5D5C0]/30 rounded-xl items-center">
                        <img 
                          src={product.imageUrl} 
                          alt={product.nameEn}
                          className="w-16 h-16 object-contain bg-gray-50 p-1 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-xs font-bold text-[#3A3530] truncate">
                            {lang === "EN" ? product.nameEn : product.nameAr}
                          </h4>
                          <span className="text-xs text-amber-800 font-sans font-bold">
                            {product.price.toLocaleString()} {t("egp")}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => {
                              addToCart(product);
                              toggleWishlist(product.id);
                            }}
                            className="bg-[#3A3530] text-white text-[9px] px-2 py-1 uppercase tracking-wider"
                          >
                            {lang === "EN" ? "Add" : "إضافة"}
                          </button>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="text-[9px] text-red-600 underline"
                          >
                            {lang === "EN" ? "Remove" : "حذف"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-full border border-[#3A3530] text-[#3A3530] py-3 text-xs tracking-wider uppercase font-bold hover:bg-gray-100 transition-colors"
            >
              {lang === "EN" ? "Continue Browsing" : "العودة للمعرض"}
            </button>
          </div>
        </div>
      )}

      {/* C. SHOPPING BAG SIDE DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-[#FAF6F0] w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="overflow-y-auto flex-1 pr-1">
              <div className="flex justify-between items-center pb-4 border-b border-[#E5D5C0]/50 mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
                  <h3 className="font-serif text-lg tracking-wider text-[#3A3530] uppercase">
                    {t("cartTitle")}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 text-gray-500 font-serif italic">
                  {t("emptyCart")}
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 bg-white p-3 border border-[#E5D5C0]/30 rounded-xl">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.nameEn}
                        className="w-16 h-16 object-contain bg-gray-50 p-1 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs font-bold text-[#3A3530] truncate">
                          {lang === "EN" ? item.product.nameEn : item.product.nameAr}
                        </h4>
                        <div className="text-xs text-amber-800 font-sans font-bold mt-0.5">
                          {item.product.price.toLocaleString()} {t("egp")}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="bg-gray-100 text-gray-800 w-5 h-5 flex items-center justify-center rounded text-xs"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold font-sans">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            className="bg-gray-100 text-gray-800 w-5 h-5 flex items-center justify-center rounded text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 self-start p-1"
                        aria-label="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-[#E5D5C0]/50 pt-6 mt-6 space-y-4">
              <div className="flex justify-between items-center text-sm font-sans font-bold">
                <span className="text-[#6E6458]">{t("subtotal")}:</span>
                <span className="text-lg text-amber-900">
                  {cartSubtotal.toLocaleString()} {t("egp")}
                </span>
              </div>

              {/* Secure Delivery Notice */}
              <div className="bg-amber-50/70 p-2.5 rounded text-[10px] text-amber-950 font-sans">
                🚚 Delivery through <strong>Egypt Post (البريد المصري)</strong> only.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="border border-gray-300 py-3 text-xs tracking-wider uppercase font-bold hover:bg-gray-100 transition-all font-sans text-center"
                >
                  {lang === "EN" ? "Add More" : "متابعة التسوق"}
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="bg-[#3A3530] text-white py-3 text-xs tracking-wider uppercase font-bold hover:bg-[#C5A880] transition-all font-sans text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("checkout")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
