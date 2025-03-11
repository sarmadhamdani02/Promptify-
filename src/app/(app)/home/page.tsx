'use client';

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { Zap } from "lucide-react";
import { createTheme, MantineProvider } from '@mantine/core';
import { Badge } from '@mantine/core';


import { User } from "next-auth";

import { Copy, Save } from "lucide-react"


import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PromptifyLogo from "@/components/PromptifyLogo";
import axios from "axios";
import { useState } from "react";

const formSchema = z.object({
  tone: z.string().optional(),
  length: z.string().optional(),
  prompt: z.string().min(1, "Prompt is required"),
  specificInput: z.string().optional(),
});

const HomePage = () => {
  const { toast } = useToast();
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");

  const theme = createTheme({
    /** Put your mantine theme override here */
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInput: "",
      tone: "",
      length: "",
      specific: "",
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsGeneratingPrompt(true);

    if (!data) {
      toast({
        title: "Error",
        description: "Please fill out all required fields",
      });
      setIsGeneratingPrompt(false);
    } else {
      try {
        const response = await axios.post("/api/promptify", {
          userInput: data.prompt?.toString(),
          tone: data.tone?.toString(),
          length: data.length?.toString(),
          specific: data.specificInput?.toString()
        });

        setEnhancedPrompt(response.data.enhancedPrompt);
        setIsDrawerOpen(true);
      } catch (error) {
        toast({
          title: "Some Error Occured",
          description: "Promptify couldn't promptified the prompt, Please Promptify Again.",
          variant: "destructive"
        });
      } finally {
        setIsGeneratingPrompt(false);
      }
    }
  };

  const onClickCopy = () => {
    navigator.clipboard.writeText(enhancedPrompt);
    if (!navigator.clipboard) {
      console.error("Clipboard API not available");
      return;
    }
    
    toast({
      title: "Copied!",
      description: "Enhanced Prompt has been copied to your clipboard",
    });
  }



  return (
    <MantineProvider theme={theme}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <Navbar />
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
          {/* Logo */}
          <PromptifyLogo />

          <h2 className="text-center text-2xl font-semibold text-gray-800 mt-4">
            Generate Your Prompt
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
              {/* Tone Input */}
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-300 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Length Input */}
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Length</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-300 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Main Prompt Input */}
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Prompt</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your prompt"
                        {...field}
                        className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Specific Input */}
              <FormField
                control={form.control}
                name="specificInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Specific Input (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter specific input"
                        {...field}
                        className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Generate Output Button */}
              <Button disabled={isGeneratingPrompt} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
                {isGeneratingPrompt ? <Zap className=" animate-spin ml-3" /> : "Promptify"}
              </Button>


            </form>
          </Form>
        </div>

        {/* Drawer to display enhanced prompt */}

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className=" ">
            <DrawerHeader>
              <DrawerTitle className="flex items-center justify-center">Generated Prompt</DrawerTitle>
              <DrawerDescription>Here is your enhanced prompt:</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 px-10 flex ">


              <Textarea
                className="bg-blue-50 px-4 py-6 rounded-lg w-screen h-full"
                value={enhancedPrompt}
                onChange={(e) => setEnhancedPrompt(e.target.value)}
              />
              <div className=" flex h-auto items-center justify-evenly flex-col">

                <Button
                  variant="default"
                  className="ml-4 w-full border border-blue-200 hover:text-white hover:bg-blue-700 bg-blue-500"
                  onClick={() => onClickCopy()}
                >
                  <Copy />Copy
                </Button>
                <Button
                  variant="default"
                  className="ml-4 w-full border border-blue-200 hover:text-white hover:bg-blue-700 bg-blue-500"
                  disabled="true"
                >
                  <Save />
                  Save

                </Button>
              </div>
            </div>
            <DrawerFooter className="flex items-center justify-center">
              <DrawerClose asChild>
                <Button variant="outline" className="w-[40%] border border-blue-200 hover:border-blue-500 hover:text-blue-500">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

      </div>
    </MantineProvider>
  );
};

export default HomePage;