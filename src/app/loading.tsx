import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Spinner />
    </div>
  );
}
