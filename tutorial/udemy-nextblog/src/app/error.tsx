'use client' // Error components must be Client Components

/* https://nextjs.org/docs/app/building-your-application/routing/error-handling */

// import { useEffect } from 'react'
// const Error = ({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string }
//   reset: () => void
// }) => {
//   useEffect(() => {
//     // Log the error to an error reporting service
//     console.error(error)
//   }, [error])

//   return (
//     <div>
//       <h2>Something went wrong!</h2>
//       <button
//         onClick={
//           // Attempt to recover by trying to re-render the segment
//           () => reset()
//         }
//       >
//         Try again
//       </button>
//     </div>
//   )
// }

const Error = ({ reset }: { reset: () => void }) => {
  return (
    <div className="bg-red-100 border-1-4 border-red-500 text-red-700 mt-4 mb-4 rounded py-2.5 px-2.5 max-w-md mx-auto">
      <h3 className="font-bold mb-2">エラーが発生しました</h3>
      <button type="button" className="bg-red-400 text-white px-4 py-2 rounded" onClick={reset}>もう一度試す<span hidden>reset は再読み込み用のメソッド（Next が用意してくれているもの）</span></button>
    </div>
  );
}

export default Error;