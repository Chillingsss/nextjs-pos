import React, { useState, useEffect, useRef } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'

const formSchema = z.object({
  barcode: z.string().min(1, {
    message: "This field is required",
  }),
  quantity: z.string()
    .min(1, { message: "Quantity is required" })
    .refine(value => !isNaN(Number(value)), { message: "Quantity must be a number" })
    .refine(value => Number(value) > 0, { message: "Quantity must be greater than 0" })
    .refine(value => Number.isInteger(Number(value)), { message: "Quantity must be an integer" }),
})

export default function Barcode({ handleAddProduct }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: "",
      quantity: "",
    },
  })

  const barcodeRef = useRef(null)

  const onSubmit = async (values) => {
    console.log(values)
    handleAddProduct(values)
    form.reset({
      barcode: "",
      quantity: "",
    })
    setTimeout(() => {
      if (barcodeRef.current) {
        barcodeRef.current.focus()
      }
    }, 0)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'F1') {
        setIsDialogOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (isDialogOpen && barcodeRef.current) {
      barcodeRef.current.focus()
    }
  }, [isDialogOpen])

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const isValid = await form.trigger()
      if (isValid) {
        form.handleSubmit(onSubmit)()
      }
    }
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter Barcode</AlertDialogTitle>
          <AlertDialogDescription>
            <Form {...form} className="space-y-8">
              <form onKeyDown={handleKeyDown} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input
                          ref={barcodeRef}
                          placeholder="Enter your barcode"
                          {...field}
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="text"  
                          placeholder="Enter quantity"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
