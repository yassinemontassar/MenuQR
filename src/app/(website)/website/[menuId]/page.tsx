
import PhonePreview from "@/components/PhoneComponenets/PhonePreview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClockIcon, ThumbsUpIcon } from "lucide-react"
import Image from "next/image"


export default function Home() {
    return (
        <div className="bg-[#f7f7f7]">
    <header className="bg-white py-4 shadow">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
    <a className="text-2xl sm:text-3xl font-bold text-[#fa4a0c]" href="#">
      MenuRapide
    </a>
    <button className="bg-[#fa4a0c] text-white px-2 py-2 rounded-full">Commencer</button>
  </div>
</header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="flex flex-col sm:flex-row gap-8">
    <div className="w-full sm:w-3/4">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Image
            alt="Tacos Chaneb Logo"
            className="h-20 w-20 rounded-full"
            height="80"
            src="/logo.png"
            width="80"
          />
          <div>
    
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 my-2">
            <h1 className="text-2xl font-bold">Texas</h1>
              <Badge variant="secondary">Top partenaire</Badge>
              <Badge>-20% sélection</Badge>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-1">
                <ThumbsUpIcon className="h-5 w-5 text-green-500" />
                <span>90%</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-5 w-5 text-gray-500" />
                <span>11:00 - 23:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input placeholder="Recherche dans Texas" type="search" />
                </div>
                <div className="flex flex-col">
                  <label className="sr-only" htmlFor="sections">
                    Sections
                  </label>
                  <Select>
                    <SelectTrigger id="sections">
                      <SelectValue placeholder="Sections" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="promotions">Promotions</SelectItem>
                      <SelectItem value="tacos">Tacos</SelectItem>
                      <SelectItem value="bowls">Bowls & Boxes</SelectItem>
                      <SelectItem value="snacks">Snacks</SelectItem>
                      <SelectItem value="boissons">Boissons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Pizza</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>PackTRIO</CardTitle>
                      <CardDescription>3 Tacos au choix + 9 pièces nuggets + 1L soda</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        alt="PackTRIO"
                        height="150"
                        src="/logo.png"
                        className="rounded-xl"
                        width="150"
                      />
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-xl font-bold">45,500DT</span>
                      <span className="text-sm line-through text-gray-500">56,000DT</span>
                      
                    </CardFooter>
                  </Card>
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Pack DUO</CardTitle>
                      <CardDescription>
                        Deux Tacos supplément fromage aux choix + 6 Pièces Nuggets + 2 Frites + 2...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        alt="Pack DUO"
                        height="150"
                        src="/logo.png"
                        className="rounded-xl"
                        width="150"
                      />
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-xl font-bold">36,000DT</span>
                      <span className="text-sm line-through text-gray-500">45,000DT</span>
                      
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
      
    )
}