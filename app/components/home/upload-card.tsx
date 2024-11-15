"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/app/utils/uploadthing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const UploadCard = ({ darkMode = true }: { darkMode: boolean }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="sm:w-[350px]"
    >
      <Card
        className={`w-full max-w-md ${
          darkMode ? "bg-zinc-800 text-white" : ""
        }`}
      >
        <CardHeader className="text-center sm:text-left">
          <CardTitle>Upload Your Music</CardTitle>
          <CardDescription className={darkMode ? "text-gray-300" : ""}>
            Select an audio file to share
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <UploadButton
              appearance={{
                button: `bg-gradient-to-r ${
                  darkMode
                    ? "from-blue-500 to-pink-400 hover:from-blue-600 hover:to-pink-500"
                    : "from-blue-600 to-pink-500 hover:from-blue-700 hover:to-pink-600"
                } text-white`,
              }}
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res[0]);
                router.push(`/listen?key=${res[0].key}&name=${res[0].name}`);
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(
                  `****! Looks like there was an error with uploading your track: ${error.message}`
                );
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
