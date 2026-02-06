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
  songId: "yJg-Y5byMMw", // Main Tera Boyfriend or similar
  birthdayDate: "2024-12-25T00:00:00", // Change this to the actual date
};

export default function Home() {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showKiss, setShowKiss] = useState(false);
  const musicSectionRef = useRef<HTMLDivElement>(null);
  
  const scrollToMusic = () => {
    musicSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    // Note: We can't auto-play youtube due to browser policies without user interaction on the frame itself usually
    toast({
      title: "Scroll down! 👇",
      description: "Let's play our song first.",
      duration: 3000,
    });
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
      <FloatingHearts />
      
      {/* 1. Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center relative p-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
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
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            You are the most special person in my life. Today is all about you.
            Get ready for a little surprise! ✨
          </p>

          <Button 
            size="lg" 
            onClick={scrollToMusic}
            className="rounded-full px-8 py-6 text-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1 group"
          >
            <Music className="w-6 h-6 mr-2 group-hover:animate-spin" />
            Play Our Song 🎶
          </Button>
        </motion.div>

        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-10 animate-float opacity-50 hidden md:block">
          <span className="text-6xl">🎈</span>
        </div>
        <div className="absolute top-1/3 right-10 animate-float-delayed opacity-50 hidden md:block">
          <span className="text-6xl">🎁</span>
        </div>
      </div>

      {/* 2. Music Section */}
      <Section id="music" className="bg-white/50 backdrop-blur-sm">
        <div ref={musicSectionRef} className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-hand font-bold text-primary mb-4">
              🎶 Our Song
            </h2>
            <p className="text-lg text-muted-foreground">
              Play this while you scroll through the rest... 💖
            </p>
          </div>
          
          <Card className="overflow-hidden shadow-xl border-primary/10 bg-white/80">
            <CardContent className="p-0 aspect-video relative">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${CONFIG.songId}?controls=1`} 
                title="Our Song" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* 3. Gallery Section */}
      <Section className="bg-gradient-to-b from-transparent to-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-hand font-bold text-primary mb-4">
              Our Memories 📸
            </h2>
            <p className="text-lg text-muted-foreground">
              Just a few of the million reasons I love you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <PhotoCard 
              src="/images/pic1.jpg" 
              caption="Your beautiful smile ✨"
              delay={0}
            />
            <PhotoCard 
              src="/images/pic4.jpg" 
              caption="Adventures together 🌍"
              delay={0.2}
            />
            <PhotoCard 
              src="/images/pic2.jpg" 
              caption="Silly moments 🤪"
              delay={0.4}
            />
            <PhotoCard 
              src="/images/pic3.jpg" 
              caption="Looking gorgeous as always 💃"
              delay={0.6}
            />
             <PhotoCard 
              src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=800&fit=crop" 
              caption="My favorite view 👀"
              delay={0.8}
            />
            <PhotoCard 
              src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=800&fit=crop" 
              caption="Forever & Always ❤️"
              delay={1.0}
            />
          </div>
        </div>
      </Section>

      {/* 4. Love Letter */}
      <Section className="py-24">
        <div className="max-w-3xl mx-auto">
          <motion.div
            whileHover={{ rotate: 1, scale: 1.01 }}
            className="bg-[#fffdf7] p-8 md:p-12 rounded-lg shadow-2xl border border-primary/10 relative overflow-hidden"
          >
            {/* Paper texture overlay could go here */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-pink-500 to-red-400 opacity-50" />
            
            <h2 className="text-4xl font-hand font-bold text-center text-primary mb-8">
              A Letter For You 💌
            </h2>
            
            <div className="font-hand text-xl md:text-2xl leading-loose text-gray-700 space-y-6">
              <p>My Dearest {CONFIG.name},</p>
              <p>
                As I sit down to write this, I realize that words aren't enough to express how much you mean to me.
                Every day with you feels like a new adventure, a new reason to smile.
              </p>
              <p>
                You have this incredible way of lighting up every room you enter. Your kindness, your laugh, your 
                strength — everything about you amazes me.
              </p>
              <p>
                On your special day, I just want you to know that you are loved beyond measure. I promise to 
                always be your biggest fan, your shoulder to lean on, and your partner in crime.
              </p>
              <p>
                Here's to another year of us, of laughter, and of love.
              </p>
              <p className="text-right mt-8 font-bold">
                Forever Yours,<br/>
                Me ❤️
              </p>
            </div>
            
            <div className="absolute -bottom-10 -right-10 text-9xl opacity-5 rotate-12 pointer-events-none">
              ❤️
            </div>
          </motion.div>
        </div>
      </Section>

      {/* 5. Birthday Countdown & Message Board */}
      <Section className="bg-white/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-hand font-bold text-primary mb-12">
            The Big Moment 🎉
          </h2>
          
          <Countdown targetDate={CONFIG.birthdayDate} onComplete={triggerConfetti} />
          
          <div className="mt-20">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Leave a Wish 💭</h3>
            <MessageBoard />
          </div>
        </div>
      </Section>

      {/* 6. Final Ending */}
      <Section className="min-h-[60vh] flex flex-col items-center justify-center text-center pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-6xl font-hand font-bold text-primary mb-8 leading-tight">
            You are my favorite person forever 💖
          </h2>
          
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <Button
              size="lg"
              onClick={() => {
                setShowKiss(true);
                triggerConfetti();
              }}
              className="relative px-12 py-8 text-2xl rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-xl text-white border-none transform transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
              Click for a Final Kiss 😘
            </Button>
          </div>
        </motion.div>
      </Section>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm">
        <p>Made with ❤️ just for you</p>
      </footer>

      {/* Kiss Popup */}
      <Dialog open={showKiss} onOpenChange={setShowKiss}>
        <DialogContent className="sm:max-w-md text-center border-none bg-white/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-4xl text-center mb-4">Mwahhh! 😘</DialogTitle>
          </DialogHeader>
          <div className="py-8">
            <div className="text-8xl animate-bounce mb-6">💋</div>
            <p className="text-2xl font-hand text-primary">
              Happy Birthday, my love!
            </p>
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
