import { Button } from "@/components/ui/button";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();

  return (
    <section id="error-page" className="w-full h-full bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">
            404
          </h1>
          <p className="mb-4 text-xl tracking-tight font-bold text-gray-900 md:text-4xl">
            Sorry, an unexpected error has occurred.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500">
            <i>
              {isRouteErrorResponse(error)
                ? // note that error is type `ErrorResponse`
                  error.data?.message || error.statusText
                : "Unknown error message"}
            </i>
          </p>
          <a href="/">
            <Button className="mt-6 w-32">Back</Button>
          </a>
        </div>
      </div>
    </section>
  );
}
