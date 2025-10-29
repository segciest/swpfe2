export default function AuthLayout({ children }: { children: React.ReactNode }) {
    console.log(">>> USING AUTH LAYOUT <<<");

    return (
        <section>
            {children}
        </section>

    );
}

// app/(auth)/layout.tsx
// export default function AuthLayout({ children }: { children: React.ReactNode }) {
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-[#eca7a7]">
//             {children}
//         </div>
//     );
// }
