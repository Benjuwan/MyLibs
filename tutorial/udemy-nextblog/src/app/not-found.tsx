import Link from "next/link";

const NotFoundPage = () => {
    return (
        <div className="grid place-content-center place-items-center min-h-screen">
            <p>here is 404 page</p>
            <Link href='/' className="block pt-8">To TOP</Link>
        </div>
    );
}

export default NotFoundPage;