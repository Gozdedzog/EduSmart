"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Linkedin, Github } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function IletisimPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setIsSent(true);
  };

  return (
    <div className="bg-gray-50">
      {/* Spacer for fixed navbar */}
      <div className="h-14" />
      
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">İletişime Geçin</span>
          </h1>
          <p className="text-xl text-gray-600">
            Görüşleriniz bizim için değerli.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Bize Mesaj Gönderin</CardTitle>
            </CardHeader>
            <CardContent>
              {isSent ? (
                <div className="text-center p-8">
                  <Send className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Mesajınız Gönderildi!</h3>
                  <p className="text-gray-600 mt-2">En kısa sürede size geri döneceğiz.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Adınız</Label>
                    <Input 
                      id="name" 
                      placeholder="Adınız Soyadınız" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresiniz</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="ornek@eposta.com" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mesajınız</Label>
                    <textarea 
                      id="message" 
                      placeholder="Mesajınızı buraya yazın..." 
                      value={formData.message} 
                      onChange={handleChange} 
                      required
                      className="w-full p-3 border border-gray-300 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-xl">
                    <Send className="w-6 h-6 mr-2" />
                    Gönder
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center md:text-left">Sosyal Medya</h3>
            <p className="text-gray-600 text-center md:text-left">
              Proje geliştirme sürecini sosyal medya hesaplarımızdan takip edebilirsiniz.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Button variant="outline" size="lg" asChild className="h-14 w-14">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-14 w-14">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-7 h-7" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-14 w-14">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Github className="w-7 h-7" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
