import Container from "@/components/ui/container";
import {Skeleton} from "@/components/ui/skeleton";

const Loading = () => {
  return (
   <Container >
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="bg-gray-100 p-8">
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="bg-gray-200 p-8">
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </Container>
  );
}
 
export default Loading;