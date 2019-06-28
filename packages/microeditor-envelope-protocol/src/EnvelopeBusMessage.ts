export interface EnvelopeBusMessage<T> {
    type: string;
    data: T;
}