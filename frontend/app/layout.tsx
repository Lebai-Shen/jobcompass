import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobCompass 求职指南针",
  description: "输入目标岗位，生成可执行的学习成长路径、真实面经和教程推荐。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
