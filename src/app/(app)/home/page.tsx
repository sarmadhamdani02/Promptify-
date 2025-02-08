'use client';

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import PromptifyLogo from "@/components/PromptifyLogo";

const formSchema = z.object({
  tone: z.string().optional(),
  length: z.string().optional(),
  prompt: z.string().min(1, "Prompt is required"),
  specificInput: z.string().optional(),
});

const HomePage = () => {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tone: "",
      length: "",
      prompt: "",
      specificInput: "",
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast({
      title: "Generated Output",
      description: "Your output has been generated successfully!",
    });
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
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
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
              Generate Output
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default HomePage;