"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useEffect, useState } from "react";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import { searchSchema } from "@/zodSchemas/searchSchema";
import { useRouter } from "next/navigation";

export default function Explore() {

    const [trends, setTrends] = useState([]);

    const router = useRouter()

    // Fetch trends on component mount
    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const response = await axios.get("/api/trends");
                setTrends(response.data.trends);
            } catch (error) {
                console.error("Error fetching trends:", error);
            }
        };
        fetchTrends();
    }, []);

    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            input: "",
        },
    })

    //  Submit handler for search form.
    async function onSubmit() {
        try {
            const inputValue = form.getValues("input")
            await router.push(`/search?q=${inputValue}`)
            form.setValue("input", "")
        } catch (error) {
            console.error("Error while submitting a input: ", error);
        }
    }

    return (
        <div className="flex justify-center">
                            {/* sticky top-0 */}
            <div className="space-y-4 py-4 px-6 sm:w-4/5">

                <Form
                    {...form}
                >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="relative">

                            <Button
                                type="submit"
                                variant="ghost"
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 hover:bg-transparent"
                            >
                                <Search
                                    className="cursor-pointer"
                                />
                            </Button>

                            <FormField
                                control={form.control}
                                name="input"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Search"
                                                {...field}
                                                className="pl-10 bg-gray-900 border-none rounded-full"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>

                <div className="bg-gray-900 rounded-xl p-4">
                    <h2 className="text-xl font-bold mb-4">Trends for you</h2>
                    {trends.map(
                        (trend: {
                            _id: string,
                            count: number
                        }) => (
                            <div key={trend._id} className="py-3 group">
                                <div>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="p-0"
                                        onClick={() => form.setValue("input", trend._id)}
                                    >
                                        <p className="font-bold">#{trend._id}</p>
                                    </Button>
                                    <p className="text-sm text-gray-500">{trend.count} posts</p>
                                </div>
                            </div>
                        ))}
                </div>


            </div>
        </div>
    )
}