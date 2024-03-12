
import PhonePreview from "@/components/PhoneComponenets/PhonePreview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClockIcon, ThumbsUpIcon } from "lucide-react"
import Image from "next/image"
import Header from "../componenets/header"
import StatsCard from "../componenets/stats"
import getMenu from "../../../../../actions/get-menu"





const WebSite = async ({
  params
}: {
  params: {menuId: string}
}) => {

  const menu = await getMenu(params.menuId);
    return (
        <div className="bg-[#f7f7f7]">
            <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="flex flex-col sm:flex-row gap-8">
    <div className="w-full sm:w-3/4">
  
      <StatsCard data={menu} />
      <div className="mt-6">
              <div className="flex gap-4 items-center">
                {/* <div className="flex-1">
                  <Input placeholder="Recherche dans Texas" type="search" />
                </div> */}
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
export default WebSite; 