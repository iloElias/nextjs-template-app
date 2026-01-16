export interface ComponentProps {
    children?: React.ReactNode
}

export const Component: React.FC<ComponentProps> = ({ children }) => {
    return <>{children}</>
}
