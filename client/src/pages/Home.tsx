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

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setKnifePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleCut = () => {
    if (!isCut) {
      setIsCut(true);
      const end = Date.now() + 2 * 1000;
      const colors = ["#FFD700", "#FFC0CB", "#FF0000"];
      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  };

  return (
    <div 
      className="relative w-full max-w-md mx-auto h-[400px] flex items-center justify-center cursor-none group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleCut}
    >
      {/* Cake Base */}
      <div className="relative w-64 h-64">
        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/10 rounded-[100%] blur-xl" />
        
        {/* Cake Body */}
        <motion.div 
          animate={isCut ? { x: -10 } : {}}
          className="absolute inset-0 bg-pink-200 rounded-lg shadow-lg border-b-8 border-pink-300"
        >
          {/* Frosting drips */}
          <div className="absolute top-0 left-0 w-full h-8 flex justify-around">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-12 bg-pink-100 rounded-full -mt-4" />
            ))}
          </div>

          {/* Name on Cake */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <span className="font-hand text-3xl text-pink-500 font-bold text-center drop-shadow-sm rotate-[-2deg]">
              {name}
            </span>
          </div>

          {/* Knife Cut Mark */}
          {isCut && (
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className="absolute left-1/2 top-0 w-2 h-full bg-pink-300/50 -translate-x-1/2 origin-top"
            />
          )}
        </motion.div>

        {/* Cake Body Right Half (if cut) */}
        {isCut && (
          <motion.div 
            initial={{ x: 0 }}
            animate={{ x: 10 }}
            className="absolute inset-0 bg-pink-200 rounded-lg shadow-lg border-b-8 border-pink-300 clip-path-right"
            style={{ clipPath: 'inset(0 0 0 50%)' }}
          >
            {/* Name Mirror */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <span className="font-hand text-3xl text-pink-500 font-bold text-center drop-shadow-sm rotate-[-2deg]">
                {name}
              </span>
            </div>
          </motion.div>
        )}

        {/* Candles */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-12 bg-yellow-200 rounded-full relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.2 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-6 bg-orange-500 rounded-full blur-[2px]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Knife Cursor */}
      {isHovering && (
        <motion.div 
          className="pointer-events-none absolute z-50 text-4xl"
          animate={{ 
            x: knifePos.x - 20, 
            y: knifePos.y - 20,
            rotate: isCut ? 45 : -15 
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.5 }}
        >
          🔪
        </motion.div>
      )}

      <div className="absolute bottom-4 left-0 w-full text-center">
        <p className="font-hand text-xl text-primary animate-bounce">
          {isCut ? "Yummy! 🍰" : "Click to cut the cake! 🔪"}
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
            <h1 className="text-5xl md:text-7xl font-bold font-hand text-primary mb-6 tracking-tight drop-shadow-sm">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              <PhotoCard src="/images/pic1.jpg" caption="Your beautiful smile ✨" delay={0} />
              <PhotoCard src="/images/pic4.jpg" caption="Adventures together 🌍" delay={0.2} />
              <PhotoCard src="/images/pic2.jpg" caption="Silly moments 🤪" delay={0.4} />
              <PhotoCard src="/images/pic3.jpg" caption="Looking gorgeous as always 💃" delay={0.6} />
              <PhotoCard src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=800&fit=crop" caption="My favorite view 👀" delay={0.8} />
              <PhotoCard src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=800&fit=crop" caption="Forever & Always ❤️" delay={1.0} />
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
                <h2 className="text-4xl font-hand font-bold text-center text-primary mb-8">A Letter For You 💌</h2>
                <div className="font-hand text-xl md:text-2xl leading-loose text-gray-700 space-y-6">
                  <p>My Dearest {CONFIG.name},</p>
                  <p>As I sit down to write this, I realize that words aren't enough to express how much you mean to me...</p>
                  <p>On your special day, I just want you to know that you are loved beyond measure.</p>
                  <p className="text-right mt-8 font-bold">Forever Yours,<br/>Me ❤️</p>
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
            <h2 className="text-4xl md:text-6xl font-hand font-bold text-primary mb-12 leading-tight">
              You are my favorite person forever 💖
            </h2>
            <div className="grid gap-12 max-w-2xl w-full mx-auto">
              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <Button
                  size="lg"
                  onClick={() => {
                    setShowKiss(true);
                    triggerConfetti();
                  }}
                  className="relative px-12 py-8 text-2xl rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-xl text-white border-none transform transition-all hover:scale-105 active:scale-95 w-full"
                >
                  <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
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
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
        <CardContent className="p-3">
          <div className="overflow-hidden rounded-md relative aspect-[3/4]">
            {/* Descriptive comment for Unsplash image */}
            {/* romantic couple photo or memory placeholder */}
            <img 
              src={src} 
              alt={caption}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <span className="text-white font-hand text-xl font-bold px-4 text-center">
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
    <div className="flex flex-col items-center bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-primary/10 w-24 md:w-32">
      <span className="text-3xl md:text-5xl font-bold text-primary font-mono tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-sm md:text-base text-muted-foreground uppercase tracking-widest mt-2 font-semibold">
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
