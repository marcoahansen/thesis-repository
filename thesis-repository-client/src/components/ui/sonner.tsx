import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      richColors
      theme="light"
      toastOptions={{}}
      closeButton
      {...props}
    />
  );
};

export { Toaster };
