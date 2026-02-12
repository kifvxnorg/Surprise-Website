import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Music, Image as ImageIcon, Gift, Sparkles, Send } from "lucide-react";
import { Section } from "@/components/Section";
import { FloatingHearts } from "@/components/FloatingHearts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCreateMessage, useMessages } from "@/hooks/use-messages";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

// === CONFIGURATION ===
const CONFIG = {
  name: "My Love",
  songId: "MBePwJgQpXk", // Updated song ID
  birthdayDate: "2024-12-25T00:00:00", // Change this to the actual date
};

function VirtualCake({ name }: { name: string }) {
  const [isCut, setIsCut] = useState(false);
  const [knifePos, setKnifePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = e.currentTarget.getBoundingClientRect();
    setKnifePos({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  const handleCut = () => {
    if (!isCut) {
      setIsCut(true);
      const end = Date.now() + 2 * 1000;
      const colors = ["#FFD700", "#FFC0CB", "#FF0000", "#FF69B4", "#FFF"];
      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  };

  return (
    <div 
      className="relative w-full max-w-sm mx-auto h-[400px] flex items-center justify-center cursor-none group touch-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      onClick={handleCut}
    >
      {/* Cake Platform */}
      <div className="absolute bottom-16 w-64 h-8 bg-pink-100 rounded-[100%] border-b-4 border-pink-200 shadow-inner" />

      {/* Cake Container */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-16">
        {/* Glow */}
        <div className="absolute inset-0 bg-pink-300/20 blur-3xl rounded-full" />
        
        {/* Cake Body */}
        <motion.div 
          animate={isCut ? { x: -15, rotate: -2 } : {}}
          className="absolute inset-0 bg-gradient-to-b from-pink-100 to-pink-200 rounded-2xl shadow-xl border-b-[12px] border-pink-300"
        >
          {/* Strawberry Toppings */}
          <div className="absolute -top-4 left-0 w-full flex justify-around px-4">
            {[...Array(4)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                className="text-2xl"
              >
                🍓
              </motion.div>
            ))}
          </div>

          {/* Fancy Frosting Drips */}
          <div className="absolute top-0 left-0 w-full h-12 flex justify-around overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="w-6 h-10 bg-white rounded-full -mt-4 shadow-sm" 
                style={{ height: `${24 + Math.random() * 16}px` }}
              />
            ))}
          </div>

          {/* Decorative Flowers */}
          <div className="absolute bottom-4 left-4 text-xl opacity-80">🌸</div>
          <div className="absolute top-12 right-6 text-xl opacity-80">✨</div>

          {/* Name on Cake */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <span className="font-hand text-3xl md:text-4xl text-pink-500 font-bold text-center drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] rotate-[-1deg]">
              {name}
            </span>
          </div>

          {/* Knife Cut Mark */}
          {isCut && (
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className="absolute left-1/2 top-0 w-3 h-full bg-white/60 -translate-x-1/2 origin-top blur-[1px]"
            />
          )}
        </motion.div>

        {/* Cake Body Right Half (if cut) */}
        {isCut && (
          <motion.div 
            initial={{ x: 0, rotate: 0 }}
            animate={{ x: 15, rotate: 2 }}
            className="absolute inset-0 bg-gradient-to-b from-pink-100 to-pink-200 rounded-2xl shadow-xl border-b-[12px] border-pink-300"
            style={{ clipPath: 'inset(0 0 0 50%)' }}
          >
             {/* Frosting drips right side */}
             <div className="absolute top-0 left-0 w-full h-12 flex justify-around overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-6 h-10 bg-white rounded-full -mt-4 shadow-sm" 
                  style={{ height: `${24 + Math.random() * 16}px` }}
                />
              ))}
            </div>

            {/* Name Mirror */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <span className="font-hand text-3xl md:text-4xl text-pink-500 font-bold text-center drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] rotate-[-1deg]">
                {name}
              </span>
            </div>
          </motion.div>
        )}

        {/* Fancy Candles */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-3 h-16 bg-gradient-to-t from-pink-300 to-yellow-100 rounded-full relative shadow-sm">
              {/* Flame */}
              {!isCut && (
                <motion.div 
                  animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [0.9, 1, 0.9],
                    y: [0, -2, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full blur-[2px] z-10"
                />
              )}
              {/* Wick */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-gray-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Knife Cursor */}
      {isHovering && !isCut && (
        <motion.div 
          className="pointer-events-none absolute z-50 text-5xl"
          animate={{ 
            x: knifePos.x - 24, 
            y: knifePos.y - 24,
            rotate: -15 
          }}
          transition={{ type: "spring", damping: 20, stiffness: 400, mass: 0.5 }}
        >
          🔪
        </motion.div>
      )}

      <div className="absolute bottom-0 left-0 w-full text-center">
        <p className="font-hand text-2xl text-primary animate-pulse font-bold tracking-wide">
          {isCut ? "Simply Delicious! 🍰✨" : "Tap to make a wish & cut! 🔪💖"}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showKiss, setShowKiss] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [step, setStep] = useState(0);
  const musicSectionRef = useRef<HTMLDivElement>(null);
  
  const turnOnLights = () => {
    setLightsOn(true);
    setIsPlaying(true);
    setStep(1); // Move to first surprise step
    toast({
      title: "Welcome! ❤️",
      description: "The lights are on and the music is playing.",
      duration: 3000,
    });
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#ff0000", "#ffa500", "#ff69b4", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative font-sans text-foreground">
      <AnimatePresence>
        {!lightsOn && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={turnOnLights}
                size="lg"
                className="rounded-full px-12 py-8 text-2xl bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.3)] group"
              >
                <Sparkles className="w-8 h-8 mr-3 text-yellow-500 group-hover:animate-pulse" />
                Turn On The Lights ✨
              </Button>
              <p className="mt-6 text-white/40 font-hand text-xl italic">
                A special surprise is waiting for you...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingHearts />
      
      {/* Surprise Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl md:text-8xl mb-6 inline-block"
            >
              ❤️
            </motion.div>
            <h1 className="text-4xl md:text-7xl font-bold font-hand text-primary mb-6 tracking-tight drop-shadow-sm px-2">
              Happy Birthday <br/> 
              <span className="text-foreground">{CONFIG.name}</span>
            </h1>
            
            <div className="mb-10 w-full max-w-lg mx-auto">
              <DailyDoseOfLove />
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              You are the most special person in my life. Today is all about you.
            </p>
            <Button size="lg" onClick={nextStep} className="rounded-full px-8 py-6 text-xl">
              See Your Memories ✨
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="min-h-screen p-4 flex flex-col items-center justify-center"
          >
            <h2 className="text-4xl md:text-5xl font-hand font-bold text-primary mb-12 text-center">
              Our Memories 📸
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-6xl mx-auto mb-12 px-2">
              <PhotoCard src="/images/pic1.jpg" caption="Your beautiful smile ✨" delay={0} />
              <PhotoCard src="/images/pic4.jpg" caption="Adventures together 🌍" delay={0.1} />
              <PhotoCard src="/images/pic2.jpg" caption="Silly moments 🤪" delay={0.2} />
              <PhotoCard src="/images/pic3.jpg" caption="Looking gorgeous as always 💃" delay={0.3} />
              <PhotoCard src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=800&fit=crop" caption="My favorite view 👀" delay={0.4} />
              <PhotoCard src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=800&fit=crop" caption="Forever & Always ❤️" delay={0.5} />
              <PhotoCard src="https://images.unsplash.com/photo-1511108690759-0013d1c1765c?w=600&h=800&fit=crop" caption="Quiet moments ☕" delay={0.6} />
              <PhotoCard src="https://images.unsplash.com/photo-1522673607200-164883efcdf1?w=600&h=800&fit=crop" caption="Pure joy ✨" delay={0.7} />
              <PhotoCard src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop" caption="Radiant as ever 🌟" delay={0.8} />
            </div>
            <Button size="lg" onClick={nextStep} className="rounded-full px-8 py-6 text-xl">
              Read My Message 💌
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-3xl w-full">
              <div className="bg-[#fffdf7] p-8 md:p-12 rounded-lg shadow-2xl border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-pink-500 to-red-400 opacity-50" />
                <h2 className="text-3xl md:text-4xl font-hand font-bold text-center text-primary mb-6">A Letter For You 💌</h2>
                <div className="font-hand text-lg md:text-2xl leading-relaxed text-gray-700 space-y-4 md:space-y-6">
                  <p>My Dearest {CONFIG.name},</p>
                  <p>As I sit down to write this, I realize that words aren't enough to express how much you mean to me...</p>
                  <p>On your special day, I just want you to know that you are loved beyond measure.</p>
                  <p className="text-right mt-6 md:mt-8 font-bold">Forever Yours,<br/>Me ❤️</p>
                </div>
              </div>
              <div className="text-center mt-12">
                <Button size="lg" onClick={nextStep} className="rounded-full px-8 py-6 text-xl">
                  Ready for the Cake? 🎂
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-hand font-bold text-primary mb-12">The Big Moment 🎉</h2>
            <Countdown targetDate={CONFIG.birthdayDate} onComplete={triggerConfetti} />
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6 text-foreground">A Special Cake for You 🎂</h3>
              <VirtualCake name={CONFIG.name} />
            </div>
            <div className="mt-12">
              <Button size="lg" onClick={nextStep} className="rounded-full px-8 py-6 text-xl">
                One Last Surprise ✨
              </Button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-hand font-bold text-primary mb-8 leading-tight">
              You are my favorite person forever 💖
            </h2>
            <div className="grid gap-8 md:gap-12 max-w-2xl w-full mx-auto px-4">
              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <Button
                  size="lg"
                  onClick={() => {
                    setShowKiss(true);
                    triggerConfetti();
                  }}
                  className="relative px-8 py-6 md:px-12 md:py-8 text-xl md:text-2xl rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-xl text-white border-none transform transition-all hover:scale-105 active:scale-95 w-full"
                >
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 animate-pulse" />
                  Click for a Final Kiss 😘
                </Button>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-6 text-foreground">Leave a Wish 💭</h3>
                <MessageBoard />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Music Player */}
      <div className="sr-only pointer-events-none">
        {isPlaying && (
          <iframe 
            width="1" 
            height="1" 
            src={`https://www.youtube.com/embed/${CONFIG.songId}?autoplay=1&controls=0`} 
            title="Our Song" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          ></iframe>
        )}
      </div>

      {/* Popups & Overlays */}
      <Dialog open={showKiss} onOpenChange={setShowKiss}>
        <DialogContent className="sm:max-w-md text-center border-none bg-white/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-4xl text-center mb-4">Mwahhh! 😘</DialogTitle>
          </DialogHeader>
          <div className="py-8">
            <div className="text-8xl animate-bounce mb-6">💋</div>
            <p className="text-2xl font-hand text-primary">Happy Birthday, my love!</p>
          </div>
          <DialogFooter className="justify-center sm:justify-center">
            <Button onClick={() => setShowKiss(false)} variant="secondary" className="rounded-full">
              Love you too! ❤️
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// === SUB-COMPONENTS ===

function PhotoCard({ src, caption, delay }: { src: string; caption: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -10 }}
    >
      <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group bg-white rounded-xl">
        <CardContent className="p-1 md:p-3">
          <div className="overflow-hidden rounded-lg relative aspect-[3/4]">
            {/* Descriptive comment for Unsplash image */}
            {/* romantic couple photo or memory placeholder */}
            <img 
              src={src} 
              alt={caption}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2 md:pb-6 px-1">
              <span className="text-white font-hand text-sm md:text-xl font-bold text-center leading-tight drop-shadow-md">
                {caption}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Countdown({ targetDate, onComplete }: { targetDate: string; onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    // If target is in past, default to a future mock date for demo purposes
    // In real app, this would be actual logic
    const difference = +new Date(targetDate) - +new Date();
    // Logic: if birthday passed this year, set for next year? 
    // For this demo, let's assume if it's passed, we show "IT'S TODAY!"
    
    // Hack for demo: always show some countdown if date is old, or show complete if close
    // Let's just hardcode a countdown for visual if the date is weird
    if (difference < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calculateTimeLeft();
      setTimeLeft(tl);
      if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        onComplete();
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // If time is up (all zeros), show surprise message
  const isTimeUp = Object.values(timeLeft).every(val => val === 0);

  if (isTimeUp) {
    return (
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        className="text-5xl md:text-7xl font-bold text-accent drop-shadow-lg animate-pulse"
      >
        🎉 SURPRISE! I LOVE YOU! ❤️
      </motion.div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-white p-3 md:p-6 rounded-2xl shadow-lg border border-primary/10 w-20 md:w-32">
      <span className="text-2xl md:text-5xl font-bold text-primary font-mono tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-base text-muted-foreground uppercase tracking-widest mt-1 md:mt-2 font-semibold text-center">
        {label}
      </span>
    </div>
  );
}

function MessageBoard() {
  const { toast } = useToast();
  const { data: messages, isLoading } = useMessages();
  const { mutate: createMessage, isPending } = useCreateMessage();
  
  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = (data: InsertMessage) => {
    createMessage(data, {
      onSuccess: () => {
        toast({ title: "Sent! 💌", description: "Your message has been added to the board." });
        form.reset();
      },
      onError: () => {
        toast({ title: "Error", description: "Could not send message.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="mb-8 border-primary/20 shadow-inner bg-white/50">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder="Write a sweet note..." 
                        className="bg-white border-primary/20 focus-visible:ring-primary"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
                {isPending ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
           <p className="text-muted-foreground">Loading sweet notes...</p>
        ) : messages?.length === 0 ? (
          <p className="text-muted-foreground italic">No messages yet. Be the first!</p>
        ) : (
          messages?.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-pink-100 text-left"
            >
              <p className="text-gray-700 font-hand text-lg">{msg.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function DailyDoseOfLove() {
  const { data, isLoading, error } = useQuery<{ content: string }>({
    queryKey: ["/api/quotes/daily"],
  });

  if (isLoading) return <div className="animate-pulse text-muted-foreground italic">Fetching your daily dose of love...</div>;
  if (error || !data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-primary/5 p-6 rounded-2xl border border-primary/20 shadow-sm"
    >
      <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
      <p className="text-xl md:text-2xl font-hand text-primary italic">
        "{data.content}"
      </p>
    </motion.div>
  );
}
