export {}
declare global {
    interface Sergiosgc { 
    }
    interface Window {
        sergiosgc: Sergiosgc;
    }
}
if (!window.sergiosgc) (window.sergiosgc as any) = {}