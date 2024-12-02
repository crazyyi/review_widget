import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import tailwindStyles from "../index.css?inline"

const MAX_CHARACTERS = 400

type StarProps = {
  className: string,
  filled: boolean,
  onClick: () => void
};

export type WidgetProps = {
  [key: string]: string; // This allows for any number of dynamic props
}

function StarIcon({ filled, ...props }: StarProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}

function MessageIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 22"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  email: z.string().min(1).email("Invalid email address."),
  feedback: z.string().min(1).max(MAX_CHARACTERS, {
    message: "Feedback is too long.",
  }),
  rating: z
    .number()
    .min(1, { message: "Please provide a rating between 1 and 5" })
    .max(5, { message: "Rating cannot exceed 5 stars" }),
});

const StarRatingField: React.FC<{
  value: number;
  onChange: (v: number) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          className={`h-5 w-5 cursor-pointer`}
          filled={index < value}
          onClick={() => onChange(index + 1)}
        />
      ))}
    </div>
  );
};

export const Widget = (props: WidgetProps) => {
  const [charCount, setCharCount] = useState(0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      feedback: "",
      rating: 3,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      projectId: props.projectId,
      userName: values.name,
      userEmail: values.email,
      message: values.feedback,
      rating: values.rating
    }
    try {
      // Send the feedback to the API server
      const response = await fetch('http://localhost:4000/feedback/addFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Feedback submitted successfully');
      } else {
        console.error('Error submitting feedback');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length)
  }

  const { isSubmitSuccessful } = form.formState

  return (
    <>
      <style>{tailwindStyles}</style>
      <div className="widget fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="rounded-full shadow-lg hover:scale-105">
              <MessageIcon />
              Feedback
            </Button>
          </PopoverTrigger>
          <PopoverContent className="widget rounded-lg bg-card p-4 shadow-lg w-full max-w-md">
            <style>{tailwindStyles}</style>
            {
              isSubmitSuccessful ? (
                <div className="flex flex-col items-center space-y-2">
                  <h3 className="font-bold">Your feedback is submitted.</h3>
                  <div>{form.getValues("name")}, thank you for your valuable input.</div>
                </div>
              ) : <div>
                <h3 className="text-lg font-bold">Send us your feedback</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="feedback"
                      render={({ field }) => (
                        <FormItem className="space-y-2 py-2">
                          <FormLabel>Feedback (no more than {MAX_CHARACTERS} words)</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Type your feedback here..." maxLength={MAX_CHARACTERS} onChange={(e) => {
                              field.onChange(e)
                              handleTextareaChange(e)
                            }} />
                          </FormControl>
                          < FormMessage />
                          {charCount > MAX_CHARACTERS - 50 &&
                            <p className="text-sm text-gray-500">
                              {MAX_CHARACTERS - charCount} / {MAX_CHARACTERS} characters left
                            </p>}
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2 py-2">
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => {
                          return <StarRatingField
                            value={field.value}
                            onChange={field.onChange}
                          />
                        }}
                      />
                    </div>
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </div>
            }
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
