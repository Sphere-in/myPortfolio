import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const EducationField = () => {
    return (
        <div className='pt-12 my-9'>
            <h2 className="text-3xl font-extrabold text-white mb-4">Qualifications</h2>
        <div className="mx-auto  flex flex-col md:flex-row gap-9 ">
            <Card className="bg-transparent border border-gray-700 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Bachelor Of Computer Application (BCA)</CardTitle>
                    <CardDescription className="text-gray-300">Kavikulguru Kalidas Sanskrit University</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-200">BCA is a three-year undergraduate degree focused on computer science and applications. It is ideal for students interested in software development, IT, and technology.</p>
                </CardContent>
            </Card>
            <Card className="bg-transparent border border-gray-700 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Higher Secondary Certificate (HSC)</CardTitle>
                    <CardDescription className="text-gray-300">Asadullah Junior College (Commerce)</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-200">The Higher Secondary Certificate (HSC) is an academic qualification awarded after completing the higher secondary education (Grade 12) in many countries. It serves as a foundation for undergraduate studies.</p>
                </CardContent>
            </Card>
        </div>
        </div>
    )
}

export default EducationField

