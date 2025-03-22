"use client"

import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface VerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  onSuccess: () => void
}

export function VerificationDialog({ open, onOpenChange, email, onSuccess }: VerificationDialogProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()

    // For demo purposes, any code is valid
    if (code.trim() === "") {
      setError("Por favor ingresa el código de verificación")
      return
    }

    // Simulate verification success
    setError("")
    // First close the dialog, then trigger success callback
    onOpenChange(false)
    // Use setTimeout to ensure state updates properly
    setTimeout(() => {
      onSuccess()
    }, 0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verificación de correo electrónico</DialogTitle>
          <DialogDescription>
            Hemos enviado un código de verificación a {email}. Por favor, ingresa el código para completar tu registro.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleVerify}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="verification-code">Código de verificación</Label>
              <Input
                id="verification-code"
                placeholder="Ingresa el código"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Verificar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

