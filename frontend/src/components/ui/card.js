export function Card({ children, className }) {
    return (
        <div className={`p-4 rounded-lg shadow-lg bg-gray-800 text-white ${className}`}>
            {children}
        </div>
    );
}
