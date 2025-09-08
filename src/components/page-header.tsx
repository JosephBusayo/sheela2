interface PageHeaderProps {
    title: string
    description?: string
  }
  
  export function PageHeader({ title, description }: PageHeaderProps) {
    return (
      <div className="bg-primary text-primary-foreground py-16 flex justify-center items-center text-center">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-balance mb-4">{title}</h1>
          {description && <p className="text-xl text-primary-foreground/80 max-w-2xl text-pretty text-center">{description}</p>}
        </div>
      </div>
    )
  }
  