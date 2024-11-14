"use client";
import { UploadButton } from "@/app/utils/uploadthing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full sm:w-[375px]"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload Your Music</CardTitle>
          <CardDescription>Select an audio file to share</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <UploadButton
              appearance={{ button: "bg-purple-500 hover:bg-purple-700" }}
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
