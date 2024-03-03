"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "@/app/hooks/use-items";
import { useParams } from "next/navigation";

const FormDataSchema = z.object({
  name: z.string().min(1, 'First name is required'),
  country: z.string().min(1, 'Country is required'),
  type: z.string().min(1, 'type is required'),
   imageUrl: z.string().min(1, 'Image is required'),
})


type Inputs = z.infer<typeof FormDataSchema>;

const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: ["name","type","imageUrl"],
  },
  {
    id: "Step 2",
    name: "Address",
    fields: ["country"],
  },
  { id: "Step 3", name: "Complete" },
];
interface Item {
  name: string;
  type: string;
  imageUrl: string;
}

interface FormProps {
  onReloadDevicePreview: () => void;
  items: Item | null;
}

const Form: React.FC<FormProps> = ({ onReloadDevicePreview, items }) => {
  const params = useParams();
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(items);
  const delta = currentStep - previousStep;
  const { replaceItem } = useStore();

  const itemData = useMemo(() => ({
    title: formData?.name ?? "",
    type: formData?.type ?? "",
    imageUrl: formData?.imageUrl ?? "",
  }), [formData?.name, formData?.type, formData?.imageUrl]);

  useEffect(() => {
    replaceItem("title", itemData.title);
    replaceItem("type", itemData.type);
    replaceItem("imageUrl", itemData.imageUrl);
  }, [items, itemData, replaceItem]);

  const {
    control,
    setValue,
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    mode: "onChange"
  });

 

  const value = watch("name");
  // console.log(value)


  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log(data);
     reset();
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });
    onReloadDevicePreview();
    if (!output) return;
    setFormData({ ...formData, ...watch() });
    console.log("imageUrl: "+formData?.imageUrl);

    if (currentStep < steps.length - 1) {
      console.log(currentStep)
      console.log(steps.length)
      if (currentStep === steps.length - 2) {
        const formData = await handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  


  return (
    <section className="absolute flex flex-col justify-between p-20">
      {/* steps */}
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-sky-600 transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-sky-600">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {/* Form */}
      <form className="mt-12 py-12" onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Provide your personal details.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    defaultValue={formData?.name}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  
                 

                  {errors.name?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  ImageUrl
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="imageUrl"
                    {...register("imageUrl", { value: formData?.imageUrl })}
                    // onChange={(event) => uploadFile(event)}
                   
                  />
                  
                 

                  {errors.imageUrl?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.imageUrl.message}
                    </p>
                  )}
                </div>
                
              </div>
                
                

              <div className="sm:col-span-3">
              <label
                  htmlFor="selectOption"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Type
                </label>
                <div className="mt-2">
                    {/* <select
                    id="selectOption"
                    {...register("selectOption")}
                    
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option></option>
                    <option>b</option>
                    <option>d</option>
                  </select> */}
               <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Select onValueChange={field.onChange}
          value={field.value} defaultValue={field.value}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={formData?.type} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="coffe">Coffe</SelectItem>
              <SelectItem value="restaucoffe">Restau-Coffe</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

                 
                  {errors.type?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>
              
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Address
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Address where you can receive mail.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Country
                </label>
                <div className="mt-2">
                  <select
                    id="country"
                    {...register("country")}
                    autoComplete="country-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                  {errors.country?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Complete
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Thank you for your submission.
            </p>
          </>
        )}
      </form>

      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
export default Form;
