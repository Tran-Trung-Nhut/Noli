export type OrderStatusDto = {
    id: number,
    status: string,
    orderId: number
    previousStatusId: number
    isCurrentStatus: boolean
    createdAt: Date
}