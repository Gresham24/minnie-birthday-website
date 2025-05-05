import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

const MinnieBirthdayInvite = () => {
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("home");
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiComplete, setConfettiComplete] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    });

    // Calculate time remaining until the event
    const calculateTimeLeft = () => {
        const eventDate = new Date("May 15, 2025 17:00:00").getTime();
        const now = new Date().getTime();
        const difference = eventDate - now;

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return { timeLeft, isComplete: difference <= 0 };
    };

    const initialTimeLeftState = calculateTimeLeft();
    const [timeLeft, setTimeLeft] = useState(initialTimeLeftState.timeLeft);
    const [countdownComplete, setCountdownComplete] = useState(
        initialTimeLeftState.isComplete
    );

    // Update countdown timer every second
    useEffect(() => {
        const timer = setTimeout(() => {
            const { timeLeft, isComplete } = calculateTimeLeft();
            setTimeLeft(timeLeft);
            setCountdownComplete(isComplete);
        }, 1000);

        return () => clearTimeout(timer);
    });

    // Handle window resize for confetti
    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Simulate loading, show confetti, and handle scroll events
    useEffect(() => {
        // Simulate loading for 2 seconds
        const loadingTimer = setTimeout(() => {
            setLoading(false);

            // Start confetti animation after loading completes
            setShowConfetti(true);

            // Hide confetti after 5 seconds
            setTimeout(() => {
                setConfettiComplete(true);
                // Keep some light confetti running
                setTimeout(() => {
                    setShowConfetti(false);
                }, 3000);
            }, 5000);
        }, 2000);

        // Handle scroll events
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);

            // Update active section based on scroll position
            const sections = [
                "home",
                "details",
                "venue",
                "dress",
                "menu",
                "rsvp",
            ];
            let currentSection = "home";

            sections.forEach((section) => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        currentSection = section;
                    }
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            clearTimeout(loadingTimer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Scroll to section
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            // Add a small delay to ensure the menu closes first on mobile
            setTimeout(() => {
                window.scrollTo({
                    top: element.offsetTop - 70,
                    behavior: "smooth",
                });
            }, 10);

            // Set active section and close menu
            setActiveSection(sectionId);
            setMenuOpen(false);
        } else {
            console.log(`Element with id ${sectionId} not found`);
        }
    };

    // Scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Floating balloon animation component
    const FloatingElement = ({ children, delay, duration, x, y }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: [0, 1, 1, 0],
                y: [0, y],
                x: [0, x],
            }}
            transition={{
                repeat: Infinity,
                duration: duration,
                delay: delay,
                repeatDelay: 1,
            }}
            className="absolute z-10"
        >
            {children}
        </motion.div>
    );

    // Loading animation
    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                    }}
                    className="w-24 h-24 mb-8"
                >
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                src="/logo.jpeg"
                                alt="Minnie Logo"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        </div>
                    </div>
                </motion.div>
                <h2 className="text-2xl font-bold text-pink-500 mb-2">
                    Welcome to Minnie's World
                </h2>
                <p className="text-white text-lg">
                    Getting everything ready...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            {/* Confetti Animation */}
            {showConfetti && (
                <Confetti
                    width={windowDimensions.width}
                    height={windowDimensions.height}
                    numberOfPieces={confettiComplete ? 50 : 200}
                    gravity={0.15}
                    colors={[
                        "#ec4899",
                        "#f472b6",
                        "#f9a8d4",
                        "#ffffff",
                        "#fde68a",
                        "#fcd34d",
                    ]}
                    recycle={!confettiComplete}
                />
            )}

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="flex items-center"
                            >
                                {/* <img 
                  src="/logo.jpeg" 
                  alt="Minnie Logo" 
                  className="w-10 h-10 rounded-full object-cover mr-2 border-2 border-pink-500"
                /> */}
                                <span className="font-cursive text-2xl font-bold text-pink-500">
                                    Minnie's World
                                </span>
                            </motion.div>
                        </div>

                        {/* Desktop navigation */}
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-4">
                                {[
                                    "home",
                                    "details",
                                    "venue",
                                    "dress",
                                    "menu",
                                    "rsvp",
                                ].map((section) => (
                                    <motion.button
                                        key={section}
                                        onClick={() => scrollToSection(section)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            activeSection === section
                                                ? "bg-pink-500 text-white"
                                                : "text-gray-300 hover:bg-pink-700 hover:text-white"
                                        }`}
                                    >
                                        {section.charAt(0).toUpperCase() +
                                            section.slice(1)}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {menuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile navigation */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                {[
                                    "home",
                                    "details",
                                    "venue",
                                    "dress",
                                    "menu",
                                    "rsvp",
                                ].map((section) => (
                                    <motion.button
                                        key={section}
                                        onClick={() => scrollToSection(section)}
                                        whileTap={{ scale: 0.95 }}
                                        className={`block w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                            activeSection === section
                                                ? "bg-pink-500 text-white"
                                                : "text-gray-300 hover:bg-pink-700 hover:text-white"
                                        }`}
                                    >
                                        {section.charAt(0).toUpperCase() +
                                            section.slice(1)}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <section
                id="home"
                className="relative min-h-screen pt-16 pb-12 flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Floating birthday elements */}
                <FloatingElement delay={0} duration={15} x={-50} y={-150}>
                    <div className="text-pink-500 text-4xl">🎂</div>
                </FloatingElement>
                <FloatingElement delay={2} duration={20} x={100} y={-200}>
                    <div className="text-pink-300 text-4xl">🎀</div>
                </FloatingElement>
                <FloatingElement delay={4} duration={18} x={-80} y={-180}>
                    <div className="text-pink-400 text-4xl">🎁</div>
                </FloatingElement>
                <FloatingElement delay={6} duration={16} x={150} y={-250}>
                    <div className="text-pink-200 text-4xl">🥂</div>
                </FloatingElement>
                <FloatingElement delay={8} duration={22} x={-120} y={-220}>
                    <div className="text-pink-600 text-4xl">✨</div>
                </FloatingElement>

                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero.jpeg"
                        alt="Minnie Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                </div>

                <div className="z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="mb-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="w-48 h-48 md:w-56 md:h-56 mx-auto mb-6 rounded-full overflow-hidden border-4 border-pink-500 shadow-2xl"
                        >
                            <img
                                src="/logo-large.jpeg"
                                alt="Minnie"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="font-cursive text-5xl md:text-6xl lg:text-7xl font-bold text-pink-500 mb-4"
                        >
                            Welcome to Minnie's World
                        </motion.h1>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6"
                        >
                            Sunset Soirée —{" "}
                            <span className="text-pink-400">
                                Crowned & Cozy
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="text-xl md:text-2xl text-gray-300"
                        >
                            Minenhle's Birthday Celebration
                        </motion.p>
                    </div>

                    {/* Countdown Timer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="mt-12 mb-8"
                    >
                        <h3 className="text-xl md:text-2xl font-semibold mb-6">
                            {countdownComplete
                                ? "The celebration is here!"
                                : "Counting down to the celebration"}
                        </h3>

                        {countdownComplete ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="bg-pink-500 bg-opacity-20 backdrop-blur-md rounded-lg p-6 border border-pink-500 max-w-md mx-auto"
                            >
                                <h4 className="text-2xl font-bold text-pink-300 mb-3">
                                    It's Party Time!
                                </h4>
                                <p className="text-lg text-white mb-4">
                                    Join us today at 5 PM for Minnie's
                                    spectacular birthday celebration!
                                </p>
                                <div className="text-4xl mb-2">🎉🥂✨</div>
                                <p className="text-sm text-gray-300">
                                    16 Hoopoe Street, Bakoven, Cape Town
                                </p>
                            </motion.div>
                        ) : (
                            <div className="flex flex-wrap justify-center gap-4">
                                {Object.entries(timeLeft).map(
                                    ([unit, value]) => (
                                        <motion.div
                                            key={unit}
                                            whileHover={{
                                                scale: 1.1,
                                                rotate: 2,
                                            }}
                                            className="w-20 h-20 md:w-24 md:h-24 bg-pink-500 bg-opacity-20 backdrop-blur-md rounded-lg flex flex-col items-center justify-center border border-pink-500 shadow-lg"
                                        >
                                            <div className="text-2xl md:text-3xl font-bold">
                                                {value}
                                            </div>
                                            <div className="text-xs md:text-sm text-gray-300">
                                                {unit}
                                            </div>
                                        </motion.div>
                                    )
                                )}
                            </div>
                        )}
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 15px rgba(236, 72, 153, 0.5)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToSection("details")}
                        className="mt-8 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full transition-colors shadow-lg hover:shadow-xl flex items-center justify-center mx-auto"
                    >
                        <span>See Details</span>
                        <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </motion.button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/4 left-8 w-8 h-8 rounded-full bg-pink-500 opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-12 w-6 h-6 rounded-full bg-pink-300 opacity-40 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-pink-600 opacity-20 animate-pulse"></div>
            </section>

            {/* Event Details Section */}
            <section
                id="details"
                className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-pink-500 mb-6">
                            Event Details
                        </h2>
                        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-center md:text-left"
                        >
                            <p className="text-xl italic text-pink-300 mb-6">
                                "I'm so excited to invite you to my post-crown
                                birthday celebration that's all about warmth,
                                gratitude, deep laughs, magical memories, and
                                stepping into a new chapter with YOU!"
                            </p>

                            <p className="text-gray-300 mb-6">
                                This isn't just any party... it's a glimpse into
                                my world—a space of elegance, intention, joy,
                                and fun. Through this invite, you'll find all
                                the important info and a few delightful
                                surprises to get you in the mood. Let's create
                                memories that'll linger long after the stars
                                come out ✨
                            </p>

                            <div className="bg-pink-900 bg-opacity-30 p-6 rounded-lg border border-pink-800 mt-8">
                                <div className="flex items-center justify-center md:justify-start mb-4">
                                    <svg
                                        className="w-6 h-6 text-pink-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <h3 className="text-xl font-bold">
                                        Date & Time
                                    </h3>
                                </div>
                                <p className="text-lg mb-2">
                                    <span className="font-semibold text-pink-300">
                                        Date:
                                    </span>{" "}
                                    26th April 2025
                                </p>
                                <p className="text-lg mb-2">
                                    <span className="font-semibold text-pink-300">
                                        Time:
                                    </span>{" "}
                                    5 PM until late
                                </p>
                                <div className="flex items-center justify-center md:justify-start mt-6 mb-2">
                                    <svg
                                        className="w-6 h-6 text-pink-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    <h3 className="text-xl font-bold">RSVP</h3>
                                </div>
                                <p className="text-lg">
                                    <span className="font-semibold text-pink-300">
                                        WhatsApp/Call:
                                    </span>{" "}
                                    +27 (12) 345-6789
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="rounded-lg overflow-hidden shadow-2xl"
                        >
                            <img
                                src="/celebration.jpeg"
                                alt="Minnie's Celebration"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center p-6 bg-pink-900 bg-opacity-20 rounded-lg border border-pink-800"
                    >
                        <h3 className="text-2xl font-cursive font-bold text-pink-400 mb-4">
                            A Heartfelt Note to My Loved Ones Far Away 🌍
                        </h3>
                        <p className="text-gray-300 mb-4">
                            As I prepare to step into this next chapter, I can't
                            help but feel a little tug on my heart knowing that
                            some of you won't be able to join us in person. Even
                            though we may be miles apart, please know that your
                            love, your energy, and your presence in my life mean
                            the world to me.
                        </p>
                        <p className="text-gray-300 mb-4">
                            I understand travel isn't always possible—but you
                            are still part of this story, and I want you to feel
                            included every step of the way.
                        </p>
                        <p className="text-gray-300 mb-4">
                            I'll be sharing special moments from the
                            evening—photos, videos, and even some live
                            snippets—so you can experience the celebration with
                            us in spirit. My deepest hope is that these glimpses
                            make you feel right here with us, wrapped in all the
                            joy and beauty of the night.
                        </p>
                        <p className="text-gray-300 mb-4">
                            Thank you for your love, your prayers, and for
                            always being part of my journey. I'll carry your
                            spirit with me as we celebrate this divine
                            milestone.
                        </p>
                        <p className="text-pink-300 italic font-semibold">
                            With so much love and gratitude,
                            <br />
                            Minnie 💋
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Venue Section */}
            <section
                id="venue"
                className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-pink-500 mb-6">
                            Venue & Directions
                        </h2>
                        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex flex-col justify-center"
                        >
                            <h3 className="text-2xl font-bold mb-6">
                                Bakoven, Cape Town
                            </h3>
                            <p className="text-gray-300 mb-4">
                                Join us for an unforgettable evening at a
                                stunning venue with ocean views, nestled in
                                beautiful Bakoven.
                            </p>

                            <div className="bg-pink-900 bg-opacity-30 p-6 rounded-lg border border-pink-800 mt-4">
                                <div className="flex items-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-pink-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <h4 className="text-lg font-semibold">
                                        Address
                                    </h4>
                                </div>
                                <p className="text-gray-300 ml-8 mb-6">
                                    16 Hoopoe Street
                                    <br />
                                    Bakoven
                                    <br />
                                    Cape Town, 8005
                                </p>

                                <div className="flex items-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-pink-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <h4 className="text-lg font-semibold">
                                        Parking Information
                                    </h4>
                                </div>
                                <p className="text-gray-300 ml-8">
                                    Limited street parking is available on
                                    Hoopoe Avenue and surrounding streets.
                                    Consider carpooling or using ride-sharing
                                    services.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    window.open(
                                        "https://www.google.com/maps/search/?api=1&query=16+Hoopoe+Avenue+Bakoven+Cape+Town",
                                        "_blank"
                                    )
                                }
                                className="mt-8 flex items-center justify-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full transition-colors shadow-lg"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                    />
                                </svg>
                                Open in Google Maps
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="rounded-lg overflow-hidden h-96 shadow-2xl"
                        >
                            <img
                                src="/location.jpeg"
                                alt="Venue Map"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Dress Code Section */}
            <section
                id="dress"
                className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-pink-500 mb-6">
                            Dress Code
                        </h2>
                        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8"></div>
                        <p className="text-xl text-pink-300 font-semibold">
                            Serving Looks, Minnie Style 💅🏾🖤🎀
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-pink-900 bg-opacity-20 rounded-xl overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-center mb-4">
                                    For the Ladies
                                </h3>
                                <div className="w-16 h-1 bg-pink-500 mx-auto mb-6"></div>
                                <p className="text-center text-gray-300 mb-4">
                                    Come through in your heels, elegant dresses
                                    or blouses in pink or black.
                                </p>
                                <p className="text-center font-serif italic text-pink-300">
                                    Be soft. Be stunning. Be you.
                                </p>
                            </div>
                            <div className="h-64 overflow-hidden">
                                <img
                                    src="/dress-ladies.jpeg"
                                    alt="Ladies Dress Code"
                                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="bg-pink-900 bg-opacity-20 rounded-xl overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-center mb-4">
                                    For the Gentlemen
                                </h3>
                                <div className="w-16 h-1 bg-pink-500 mx-auto mb-6"></div>
                                <p className="text-center text-gray-300 mb-4">
                                    Sneakers are welcome, but let's keep it
                                    classy. Pink or black only.
                                </p>
                                <p className="text-center font-bold text-red-400">
                                    No sandals or blue jeans
                                </p>
                            </div>
                            <div className="h-64 overflow-hidden">
                                <img
                                    src="/dress-men.jpeg"
                                    alt="Gentlemen Dress Code"
                                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-pink-900 bg-opacity-20 rounded-xl overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-center mb-4">
                                    PJ Slumber Party
                                </h3>
                                <div className="w-16 h-1 bg-pink-500 mx-auto mb-6"></div>
                                <p className="text-center text-gray-300 mb-4">
                                    To those that'll be sleeping over, slip into your
                                    PJs, unwind, and enjoy some cozy chaos.
                                </p>
                                <p className="text-center text-pink-300">
                                    <span className="font-semibold">P.S.</span>{" "}
                                    There's a little gift waiting for you!
                                </p>
                            </div>
                            {/* <div className="h-64 overflow-hidden">
                
                <img 
                  src="/api/placeholder/400/300" 
                  alt="PJ Party" 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div> */}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <p className="text-lg italic text-gray-300">
                            "I don't wanna fight, okay?! 😭 Let's all look cute
                            for the camera. Be you."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Menu Section */}
            <section
                id="menu"
                className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-pink-500 mb-6">
                            Menu
                        </h2>
                        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-pink-900 bg-opacity-30 p-8 rounded-lg border border-pink-800">
                                <h3 className="text-2xl font-cursive font-bold text-center text-pink-400 mb-6">
                                    Pink Hour
                                </h3>

                                <div className="mb-8">
                                    <h4 className="text-xl font-bold text-center mb-4">
                                        STARTER
                                    </h4>
                                    <p className="text-center text-gray-300">
                                        Sausage rolls, loaded potato skins,
                                        Jalapeño Poppers, Crackers, Cheese or
                                        Fruit Board
                                    </p>
                                </div>

                                <div className="mb-8">
                                    <h4 className="text-xl font-bold text-center mb-4">
                                        MAIN
                                    </h4>
                                    <p className="text-center text-gray-300">
                                        Grilled chicken accompanied by roasted
                                        potatoes and a side of seasonal
                                        vegetables
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xl font-bold text-center mb-4">
                                        DESSERT
                                    </h4>
                                    <p className="text-center text-gray-300">
                                        Chocolate and Vanilla Cake, Caramel
                                        Popcorn, Cupcakes
                                    </p>
                                </div>

                                <div className="mt-10 pt-6 border-t border-pink-800 text-center">
                                    <p className="text-lg text-pink-300 font-cursive">
                                        A Minnie Moment: Sunset & Slumber
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.03 }}
                            className="bg-pink-900 bg-opacity-30 p-6 rounded-lg border border-pink-800 mt-8 shadow-lg transform hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="flex items-center justify-center mb-4">
                                <svg
                                    className="w-8 h-8 text-pink-500 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h4 className="text-xl font-semibold">
                                    N.B: BYOB 🥂🍻
                                </h4>
                            </div>
                            <p className="text-center text-gray-300">
                                Let's toast to life, growth, and everything in
                                between.
                            </p>
                            <motion.p
                                whileHover={{ scale: 1.05 }}
                                className="text-center text-gray-400 italic mt-4 bg-black bg-opacity-30 p-3 rounded-lg"
                            >
                                "Welcome to Minnie's World, where the vibes are
                                five-star. Even if the chef (me) is still in her
                                cooking class era 😅✨"
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* RSVP Section */}
            <section
                id="rsvp"
                className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-40 h-40 bg-pink-500 rounded-full opacity-5 blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-300 rounded-full opacity-5 blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-pink-500 mb-6">
                            RSVP
                        </h2>
                        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8"></div>
                    </motion.div>

                    <div className="max-w-2xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-pink-900 bg-opacity-30 p-8 md:p-10 rounded-lg border border-pink-800 text-center shadow-2xl relative overflow-hidden"
                        >
                            {/* Dancing party emoji */}
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute top-6 left-6 text-3xl z-10"
                            >
                                🎉
                            </motion.div>

                            {/* Dancing party emoji */}
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    delay: 0.5,
                                }}
                                className="absolute top-6 right-6 text-3xl z-10"
                            >
                                🎊
                            </motion.div>

                            <motion.h3
                                initial={{ y: -20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="text-2xl md:text-3xl font-bold mb-6 font-cursive text-pink-300"
                            >
                                Let Minnie know you're coming!
                            </motion.h3>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="text-gray-300 mb-8"
                            >
                                Please RSVP by April 24, 2025, so we can prepare
                                for your arrival and make sure everything is
                                perfect.
                            </motion.p>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center justify-center mb-8 bg-black bg-opacity-30 p-4 rounded-xl mx-auto max-w-xs"
                            >
                                <svg
                                    className="w-8 h-8 text-pink-500 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                <p className="text-xl font-semibold">
                                    +27 (12) 345-6789
                                </p>
                            </motion.div>

                            <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
                                <motion.button
                                    initial={{ x: -20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow:
                                            "0 0 15px rgba(236, 72, 153, 0.5)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        window.open(
                                            "tel:+27123456789"
                                        )
                                    }
                                    className="flex items-center justify-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full transition-all duration-300 shadow-lg"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    Call
                                </motion.button>

                                <motion.button
                                    initial={{ x: 20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow:
                                            "0 0 15px rgba(74, 222, 128, 0.5)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        window.open(
                                            "#"
                                        )
                                    }
                                    className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final Note Section */}
            <section
                id="note"
                className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden"
            >
                {/* Floating elements */}
                <FloatingElement delay={0} duration={18} x={-70} y={-180}>
                    <div className="text-pink-500 text-4xl">💖</div>
                </FloatingElement>
                <FloatingElement delay={3} duration={20} x={120} y={-220}>
                    <div className="text-pink-300 text-4xl">✨</div>
                </FloatingElement>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-pink-900 bg-opacity-20 p-8 md:p-12 rounded-lg border border-pink-800 text-center shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500 opacity-10 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-300 opacity-10 rounded-full blur-2xl"></div>

                        <motion.h2
                            initial={{ y: -20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-pink-500 mb-8"
                        >
                            Final Note from Your Girl Minnie 🖤
                        </motion.h2>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-xl text-gray-300 mb-6"
                        >
                            Just a little thank you—from the bottom of my heart.
                        </motion.p>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-gray-300 mb-6"
                        >
                            Thank you for the love, the light, the energy, and
                            for simply being here. Whether you've walked with me
                            through every season or are joining this one fresh,
                            your presence means the world.
                        </motion.p>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-gray-300 mb-6"
                        >
                            I can't wait to laugh, eat, dance, and vibe with you
                            under the stars. Your support and love have shaped
                            this moment more than you know.
                        </motion.p>

                        <motion.p
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-2xl font-cursive text-pink-400 mb-6"
                        >
                            Welcome to Minnie's World.
                        </motion.p>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-lg text-pink-300 italic"
                        >
                            With all my love, always,
                            <br />
                            Minnie 💋
                        </motion.p>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05, rotate: 3 }}
                            className="mt-12"
                        >
                            <img
                                src="/hero.jpeg"
                                alt="Minnie"
                                className="w-36 h-36 mx-auto rounded-full object-cover border-4 border-white-500 shadow-xl"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center items-center mb-4">
                        <motion.img
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            src="/logo.jpeg"
                            alt="Minnie Logo"
                            className="w-10 h-10 rounded-full object-cover mr-2 border-2 border-pink-500"
                        />
                    </div>
                    <p className="text-gray-400">
                        © 2025 | Website by <a target="_blank" rel="noopener noreferrer" href="https://gresham24.com/" className="text-pink-500 hover:text-pink-400 transition-colors duration-300 underline decoration-pink-500/30 hover:decoration-pink-400/50">Gresham Tembo</a>
                    </p>
                </div>
            </footer>

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        whileHover={{
                            scale: 1.1,
                            boxShadow: "0 0 15px rgba(236, 72, 153, 0.5)",
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center shadow-lg z-50"
                    >
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

// Apply some global styles
const AppWithStyles = () => {
    useEffect(() => {
        // Add custom fonts
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        // Add custom styles
        const style = document.createElement("style");
        style.textContent = `
      body {
        font-family: 'Poppins', sans-serif;
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23ec4899"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>') 12 12, auto;
      }
      a, button {
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23ec4899"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="5"/></svg>') 12 12, pointer;
      }
      .font-cursive {
        font-family: 'Dancing Script', cursive;
      }
      ::selection {
        background-color: rgba(236, 72, 153, 0.3);
      }
      ::-webkit-scrollbar {
        width: 10px;
      }
      ::-webkit-scrollbar-track {
        background: #1a1a1a;
      }
      ::-webkit-scrollbar-thumb {
        background: #ec4899;
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #d946ef;
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(link);
            document.head.removeChild(style);
        };
    }, []);

    return <MinnieBirthdayInvite />;
};

export default AppWithStyles;
