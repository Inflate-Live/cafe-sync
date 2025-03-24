
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';

const RatingModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const { submitFeedback } = useAppContext();
  const { toast } = useToast();

  // This will be triggered from an order completion action
  // For demonstration, we'll add a simple event listener to window
  React.useEffect(() => {
    const handleFeedbackRequest = (event: CustomEvent) => {
      if (event.detail && event.detail.orderId) {
        setCurrentOrderId(event.detail.orderId);
        setOpen(true);
      }
    };

    window.addEventListener('requestFeedback' as any, handleFeedbackRequest as any);
    
    return () => {
      window.removeEventListener('requestFeedback' as any, handleFeedbackRequest as any);
    };
  }, []);

  const handleSubmit = () => {
    if (currentOrderId && rating > 0) {
      submitFeedback(currentOrderId, rating, comment);
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your rating helps us improve our service.",
      });
      
      // Reset form
      setRating(0);
      setComment('');
      setCurrentOrderId(null);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>
            Please let us know how we did. Your feedback helps us improve!
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  size={32}
                  className={`transition-colors ${
                    (hoverRating || rating) >= star
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Any additional comments? (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="h-24"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Skip</Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>Submit Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
