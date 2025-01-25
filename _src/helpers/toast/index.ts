import { useToastProvider, type Bread } from "~/_src/providers/ToastProvider";

export const push = (
  message: Bread["message"],
  opts?: Partial<Omit<Bread, "message">>
) => {
  const { push } = useToastProvider();
  push(message, opts);
};

const toast = { push } as const;

export default toast;
