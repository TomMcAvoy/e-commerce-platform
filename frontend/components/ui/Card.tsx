import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`card bg-white rounded-lg shadow-sm border border-gray-200 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`card-header flex flex-col space-y-1.5 p-6 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={`card-title text-2xl font-semibold leading-none tracking-tight ${className}`.trim()}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={`card-description text-sm text-muted-foreground ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: CardContentProps) {
  return (
    <div
      className={`card-content p-6 pt-0 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: CardFooterProps) {
  return (
    <div
      className={`card-footer flex items-center p-6 pt-0 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
