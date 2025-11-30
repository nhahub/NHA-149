import { useState } from "react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardBadge,
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export default function StyleShowcasePage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen bg-animated py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gradient mb-4">
            Design System Showcase
          </h1>
          <p className="text-xl text-secondary-700 max-w-2xl mx-auto">
            Explore the modern, professional design system with Ocean theme
            colors and beautiful animations.
          </p>
        </div>

        {/* Color Palette */}
        <Card variant="modern" className="p-8">
          <CardHeader className="text-center pb-8">
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Primary, Secondary, and Accent colors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary Colors */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-secondary-800">
                  Primary (Ocean Blue)
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                    (weight) => (
                      <div key={weight} className="space-y-1">
                        <div
                          className={`h-12 rounded-lg bg-primary-${weight} border border-gray-200`}
                          title={`primary-${weight}`}
                        ></div>
                        <span className="text-xs text-secondary-600">{weight}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Secondary Colors */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-secondary-800">
                  Secondary (Deep Navy)
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                    (weight) => (
                      <div key={weight} className="space-y-1">
                        <div
                          className={`h-12 rounded-lg bg-secondary-${weight} border border-gray-200`}
                          title={`secondary-${weight}`}
                        ></div>
                        <span className="text-xs text-secondary-600">{weight}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Accent Colors */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-secondary-800">
                  Accent (Coral Orange)
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                    (weight) => (
                      <div key={weight} className="space-y-1">
                        <div
                          className={`h-12 rounded-lg bg-accent-${weight} border border-gray-200`}
                          title={`accent-${weight}`}
                        ></div>
                        <span className="text-xs text-secondary-600">{weight}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card variant="modern" className="p-8">
          <CardHeader className="text-center pb-8">
            <CardTitle>Button Components</CardTitle>
            <CardDescription>
              Various button styles with hover effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Button Variants */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Variants</h3>
                <div className="space-y-3">
                  <Button variant="default" className="w-full">
                    Primary Button
                  </Button>
                  <Button variant="outline" className="w-full">
                    Outline Button
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Secondary Button
                  </Button>
                  <Button variant="ghost" className="w-full">
                    Ghost Button
                  </Button>
                  <Button variant="glass" className="w-full">
                    Glass Button
                  </Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Sizes</h3>
                <div className="space-y-3">
                  <Button size="sm" className="w-full">
                    Small
                  </Button>
                  <Button size="default" className="w-full">
                    Default
                  </Button>
                  <Button size="lg" className="w-full">
                    Large
                  </Button>
                  <Button size="xl" className="w-full">
                    Extra Large
                  </Button>
                </div>
              </div>

              {/* Button States */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">States</h3>
                <div className="space-y-3">
                  <Button variant="success" className="w-full">
                    Success
                  </Button>
                  <Button variant="warning" className="w-full">
                    Warning
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Destructive
                  </Button>
                  <Button disabled className="w-full">
                    Disabled
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card variant="modern" className="p-8">
          <CardHeader className="text-center pb-8">
            <CardTitle>Card Components</CardTitle>
            <CardDescription>Different card styles and effects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Default Card */}
              <Card variant="default" className="p-6">
                <CardIcon>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </CardIcon>
                <CardTitle className="text-lg">Default Card</CardTitle>
                <CardDescription>
                  Standard card with subtle effects
                </CardDescription>
                <div className="mt-4">
                  <CardBadge variant="default">Default</CardBadge>
                </div>
              </Card>

              {/* Glass Card */}
              <Card variant="glass" className="p-6">
                <CardIcon className="bg-white/20">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </CardIcon>
                <CardTitle className="text-lg text-white">Glass Card</CardTitle>
                <CardDescription className="text-white/80">
                  Glass morphism effect
                </CardDescription>
                <div className="mt-4">
                  <CardBadge variant="success">Glass</CardBadge>
                </div>
              </Card>

              {/* Elevated Card */}
              <Card variant="elevated" className="p-6">
                <CardIcon className="bg-gradient-accent">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </CardIcon>
                <CardTitle className="text-lg">Elevated Card</CardTitle>
                <CardDescription>Enhanced shadow and depth</CardDescription>
                <div className="mt-4">
                  <CardBadge variant="accent">Elevated</CardBadge>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card variant="modern" className="p-8">
          <CardHeader className="text-center pb-8">
            <CardTitle>Input Components</CardTitle>
            <CardDescription>
              Modern input fields with enhanced focus states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Variants */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Input Variants</h3>
                <div className="space-y-4">
                  <Input
                    variant="modern"
                    placeholder="Modern input..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Input variant="glass" placeholder="Glass input..." />
                  <Input variant="filled" placeholder="Filled input..." />
                  <Input variant="error" placeholder="Error state..." />
                  <Input variant="success" placeholder="Success state..." />
                </div>
              </div>

              {/* Input Sizes */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Input Sizes</h3>
                <div className="space-y-4">
                  <Input size="sm" placeholder="Small input..." />
                  <Input size="default" placeholder="Default input..." />
                  <Input size="lg" placeholder="Large input..." />
                  <Input type="email" placeholder="Email input..." />
                  <Input type="password" placeholder="Password input..." />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Effects */}
        <Card variant="modern" className="p-8">
          <CardHeader className="text-center pb-8">
            <CardTitle>Background Effects</CardTitle>
            <CardDescription>Animated and gradient backgrounds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-primary p-6 rounded-2xl text-white">
                <h3 className="font-semibold mb-2">Primary Gradient</h3>
                <p className="text-sm text-white/80">
                  Beautiful primary gradient background
                </p>
              </div>

              <div className="bg-gradient-accent p-6 rounded-2xl text-white">
                <h3 className="font-semibold mb-2">Accent Gradient</h3>
                <p className="text-sm text-white/80">
                  Energetic accent gradient
                </p>
              </div>

              <div className="bg-gradient-ocean p-6 rounded-2xl text-white">
                <h3 className="font-semibold mb-2">Ocean Gradient</h3>
                <p className="text-sm text-white/80">
                  Cool ocean inspired gradient
                </p>
              </div>

              <div className="bg-animated-hero p-6 rounded-2xl text-white">
                <h3 className="font-semibold mb-2">Animated Hero</h3>
                <p className="text-sm text-white/80">
                  Dynamic animated background
                </p>
              </div>

              <div className="glass p-6 rounded-2xl">
                <h3 className="font-semibold mb-2">Glass Effect</h3>
                <p className="text-sm text-secondary-600">Subtle glass morphism</p>
              </div>

              <div className="bg-mesh p-6 rounded-2xl bg-white">
                <h3 className="font-semibold mb-2">Mesh Pattern</h3>
                <p className="text-sm text-secondary-600">Subtle mesh background</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animation Examples */}
        <Card variant="modern" className="p-8">
          <CardHeader className="text-center pb-8">
            <CardTitle>Animations</CardTitle>
            <CardDescription>
              Smooth animations and micro-interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-4">
                <div className="float bg-primary-100 p-6 rounded-2xl">
                  <h4 className="font-semibold">Float</h4>
                </div>
                <p className="text-sm text-secondary-600">
                  Gentle floating animation
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="pulse-glow bg-accent-100 p-6 rounded-2xl">
                  <h4 className="font-semibold">Pulse Glow</h4>
                </div>
                <p className="text-sm text-secondary-600">Pulsing glow effect</p>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-primary-100 p-6 rounded-2xl">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h4 className="font-semibold mt-2">Loading</h4>
                </div>
                <p className="text-sm text-secondary-600">Loading dots animation</p>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-6 rounded-2xl text-white hover:scale-105 transition-transform">
                  <h4 className="font-semibold">Hover Scale</h4>
                </div>
                <p className="text-sm text-secondary-600">Scale on hover</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card variant="gradient" className="p-8">
          <CardHeader className="text-center pb-6">
            <CardTitle>How to Use</CardTitle>
            <CardDescription>
              Quick guide to implementing the design system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Component Usage</h3>
                <pre className="bg-secondary-800 text-secondary-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {`<Button variant="default">
  Primary Action
</Button>

<Card variant="modern">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>`}
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Utility Classes</h3>
                <pre className="bg-secondary-800 text-secondary-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {`<div className="bg-animated">
  Animated background
</div>

<h1 className="text-gradient">
  Gradient text
</h1>

<div className="glass">
  Glass effect
</div>`}
                </pre>
              </div>
            </div>

            <div className="bg-primary-50 p-6 rounded-xl border border-primary-200">
              <h4 className="font-semibold text-primary-800 mb-2">
                💡 Pro Tip
              </h4>
              <p className="text-primary-700">
                Check the{" "}
                <code className="bg-primary-100 px-2 py-1 rounded">
                  DESIGN_SYSTEM.md
                </code>{" "}
                file for complete documentation and the{" "}
                <code className="bg-primary-100 px-2 py-1 rounded">
                  src/config/theme.js
                </code>{" "}
                file to easily customize colors.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
