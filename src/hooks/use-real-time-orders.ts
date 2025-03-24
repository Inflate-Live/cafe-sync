
import { useState, useEffect, useRef } from 'react';
import { Order } from '@/types';
import { useAppContext } from '@/context/AppContext';

/**
 * Hook for real-time order updates in the Kitchen page
 */
export const useRealTimeOrders = (branchId: string) => {
  const { orders } = useAppContext();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [cookingOrders, setCookingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [rejectedOrders, setRejectedOrders] = useState<Order[]>([]);
  const [newOrderReceived, setNewOrderReceived] = useState(false);
  const previousPendingCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.onerror = () => {
      if (audioRef.current) {
        audioRef.current.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwMD09PT09PT09PT09PT1LSUlJSUlJWFhYWFhYZmZmZmZmdnZ2dnZ2dnZ2dnZ2hoaGhoaGlpaWlpaWpKSkpKSksbGxsbGxsbGxsbGxwcHBwcHBzs7Ozs7O3d3d3d3d6urq6urq9PT09PT09PT09PT0//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYHg/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+0DEAANBmQVhtAAAIKiGdDbwAASQQ+C0MkGMQYuDtGJYg+NCIQgf/82cLBv/4Rzj/88CeWiECj/+7f//oMomM8OEbgQYRCuMx7r//rUIhQEkZvLrEQYuFCP//////4kBpMOAmICACaCYRG49GJE5QAUAJsR//7kG0AQZGIHg4YUICg6UVP/////9h2M2bnRMGAKbJ0wAL4AEJuAIBAyRyKM2U9nf///////MsCU+ZJK0l7AxJQXF60k5WJc2IyY8SjuQGBKZBhpABgkU8oDJJGVKHUEKCDwOo5Gwy2qbLKbLKTNKTLKUtqm0s0paXaXaXaWaXaWaW//80qbKTN6aqbSzSbS0y7S7SbS7S//s0u0s0m0s0u0u0s0u0s0u0s0u0u0s0u0u0s0u0u0s0u0s0u0u0s0u0u0v/+zS7S7S7S7SzS7S7S7S7S7S7S7S7S7S7S7S7S7S7S7S7S7S7S7S7S7S7S7S7S7S7/+0DEFAPUPPt5vPAACk2hrbeeBgJdLtLtLtLtLtLtLtLtLtLsulJmtU000zWaaaazSkmU0pMppSZTSmaaUmaaaUmaaDSZTSZppM00zTSZppMiSZJkmkmSZJpkmiZNJMmTJM0mSZJkmkmTJJkf/5pMmSZJpJkySZJkmSZJk//+SZJkyZJkymkmaZJpJmiZJkysZJlMyZJkmaUmU0pM0pJkmaaaaaaTNNJmmmaaaZppM0000zTSZpppp//+aaaZrSZpppmlJmlJmlJlNKTKaUmaaaaTNNJmmmaaazWmk//+aaaazTTTNNJmmmmmmaaUmaUmaUkzTS0v/+zSmkmaaaUmf/5pSZpSZpSmtJn/+TNKTNKTNaZ/9Jn/nBEoN2nx9NLNYAQAAAAAAAAAAAA//sQxE+D0AAAAH+HAAAIQAAAP8AAAAAAAA0gAAAAAA/4Eg5Ifg+D4Pg+D4AAAAB8HwfB8HwfP+CAIAgCAfP/BklXVHw+H4fwfB8H//B/4fh+H4fB8Hwf/8Hwf//wQBAEAQDgPnOXPC+CIIwtdRSDF4Q3AyT4MhcAf8HwfP///+oNQKmh///D4Pn///3XUkxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
      }
    };
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);

  // Update order lists when orders change
  useEffect(() => {
    // Filter orders by branch and status
    const filteredPendingOrders = orders.filter(
      order => order.branchId === branchId && order.status === 'pending'
    );
    const filteredCookingOrders = orders.filter(
      order => order.branchId === branchId && order.status === 'cooking'
    );
    const filteredCompletedOrders = orders.filter(
      order => order.branchId === branchId && order.status === 'completed'
    );
    const filteredRejectedOrders = orders.filter(
      order => order.branchId === branchId && order.status === 'rejected'
    );

    // Check if there are new pending orders
    const currentPendingCount = filteredPendingOrders.length;
    if (currentPendingCount > previousPendingCount.current) {
      setNewOrderReceived(true);
      // Play sound notification
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    } else {
      setNewOrderReceived(false);
    }
    previousPendingCount.current = currentPendingCount;

    // Update state with filtered orders
    setPendingOrders(filteredPendingOrders);
    setCookingOrders(filteredCookingOrders);
    setCompletedOrders(filteredCompletedOrders);
    setRejectedOrders(filteredRejectedOrders);
  }, [orders, branchId]);

  return {
    pendingOrders,
    cookingOrders,
    completedOrders,
    rejectedOrders,
    newOrderReceived,
  };
};
