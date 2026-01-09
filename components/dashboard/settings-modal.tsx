"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings, User, Mail, Lock, Image as ImageIcon, CreditCard, Info } from "lucide-react"
import { motion } from "framer-motion"

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [username, setUsername] = useState("user123")
  const [email, setEmail] = useState("user@example.com")
  const [profilePic, setProfilePic] = useState("/placeholder-user.jpg")

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfilePic(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl border border-white/10 bg-white/10 text-white/80 shadow-lg hover:border-white/20 hover:bg-white/20 hover:text-white"
          style={{
            boxShadow: "0 0 24px #fff4, 0 2px 8px #0008",
            backdropFilter: "blur(12px)",
          }}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 bg-black/90 border border-white/10 backdrop-blur-lg"
        style={{ backdropFilter: "blur(20px)" }}
        align="end"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          <div className="space-y-4 p-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">Settings</h3>
              <Info className="h-4 w-4 text-white/50" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-black/80 p-1"
                  >
                    <Label htmlFor="profile-pic-upload" className="cursor-pointer">
                      <ImageIcon className="h-4 w-4 text-white" />
                    </Label>
                    <Input
                      id="profile-pic-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePicUpload}
                    />
                  </motion.div>
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-white/60">Username</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-white/60">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full bg-white/10 text-white hover:bg-white/20">
                  <Lock className="mr-2 h-4 w-4" />
                  Reset Password
                </Button>
                <Button variant="outline" className="w-full bg-white/10 text-white hover:bg-white/20">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium text-white">Global Settings</h4>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-white/60">Dark Mode</Label>
                  <Button variant="ghost" size="sm" className="text-white/60">
                    Toggle
                  </Button>
                </div>
              </div>

              <div className="text-center text-xs text-white/40 pt-4 border-t border-white/10">
                <p>Developed by Lucky Clover Studios</p>
                <p>luckyclover.org</p>
              </div>
            </div>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  )
}