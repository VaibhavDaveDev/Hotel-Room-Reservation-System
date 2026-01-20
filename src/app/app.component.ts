import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Room {
    id: string;
    floor: number;
    roomNumber: number;
    roomIndex: number;
    isBooked: boolean;
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    readonly TOTAL_FLOORS = 10;

    rooms: Room[] = [];
    floors: number[] = [];
    requestCount: number | null = null;
    message: string = "Welcome! Enter number of rooms to book.";

    constructor() {
        this.rooms = this.generateRooms();
        this.floors = Array.from({ length: 10 }, (_, i) => 10 - i);
    }

    generateRooms(): Room[] {
        let rooms: Room[] = [];
        for (let f = 1; f <= this.TOTAL_FLOORS; f++) {
            const numRooms = f === 10 ? 7 : 10; // Top floor has fewer rooms
            for (let r = 1; r <= numRooms; r++) {
                rooms.push({
                    id: `${f}-${r}`,
                    floor: f,
                    roomNumber: f * 100 + r,
                    roomIndex: r,
                    isBooked: false
                });
            }
        }
        return rooms;
    }

    // MAIN BOOKING FUNCTION
    bookRooms() {
        const n = this.requestCount;
        if (!this.validateRequest(n)) return;

        // Step A: Try to find rooms on the same floor (Priority 1)
        let selectedRooms = this.findBestSameFloor(n!);

        // Step B: If failed, try across multiple floors (Priority 2)
        if (!selectedRooms) {
            selectedRooms = this.findBestAcrossFloors(n!);
        }

        // Step C: Finalize
        if (selectedRooms) {
            this.confirmBooking(selectedRooms);
        } else {
            this.message = "Not enough rooms available to satisfy this request.";
        }
    }

    // Priority 1: Check every floor for a group of 'n' available rooms
    findBestSameFloor(n: number): Room[] | null {
        let bestSet: Room[] | null = null;
        let minTravel = Infinity;

        for (let f = 1; f <= this.TOTAL_FLOORS; f++) {
            const floorRooms = this.getAvailableRooms().filter(r => r.floor === f);

            // Sliding window: check groups of 'n' rooms
            if (floorRooms.length >= n) {
                for (let i = 0; i <= floorRooms.length - n; i++) {
                    const group = floorRooms.slice(i, i + n);
                    const travelTime = group[n - 1].roomIndex - group[0].roomIndex; // Horizontal distance

                    if (travelTime < minTravel) {
                        minTravel = travelTime;
                        bestSet = group;
                    }
                }
            }
        }
        return bestSet;
    }

    // Priority 2: Use "Seed" approach to find closest cluster
    findBestAcrossFloors(n: number): Room[] | null {
        const available = this.getAvailableRooms();
        if (available.length < n) return null;

        let bestCluster: Room[] | null = null;
        let minClusterCost = Infinity;

        // Try every room as a "starting point" (seed)
        for (const seed of available) {
            // 1. Get N closest rooms to this seed
            const closestRooms = available
                .map(r => ({ ...r, distance: this.calculateDistance(seed, r) }))
                .sort((a, b) => a.distance - b.distance)
                .slice(0, n);

            // 2. Calculate the total "spread" (bounding box) of this group
            const cost = this.calculateClusterCost(closestRooms);

            if (cost < minClusterCost) {
                minClusterCost = cost;
                // Map back to original room objects to remove the 'distance' property
                bestCluster = this.rooms.filter(original => closestRooms.some(c => c.id === original.id));
            }
        }
        return bestCluster;
    }

    // Cost between two specific rooms
    calculateDistance(r1: Room, r2: Room): number {
        const vertical = Math.abs(r1.floor - r2.floor) * 2;
        const horizontal = Math.abs(r1.roomIndex - r2.roomIndex);
        return vertical + horizontal;
    }

    // Cost of a whole group (Bounding Box)
    calculateClusterCost(group: any[]): number {
        const floors = group.map(r => r.floor);
        const indexes = group.map(r => r.roomIndex);

        const floorSpan = (Math.max(...floors) - Math.min(...floors)) * 2;
        const roomSpan = Math.max(...indexes) - Math.min(...indexes);

        return floorSpan + roomSpan;
    }

    // UI & STATE UPDATES

    validateRequest(n: number | null): boolean {
        if (!n || n < 1 || n > 5) {
            this.message = "Please enter between 1 and 5 rooms.";
            return false;
        }
        return true;
    }

    confirmBooking(roomsToBook: Room[]) {
        const ids = roomsToBook.map(r => r.id);
        this.rooms.forEach(r => {
            if (ids.includes(r.id)) r.isBooked = true;
        });

        const names = roomsToBook.map(r => r.roomNumber).join(", ");
        this.message = `Booked: ${names}`;
        this.requestCount = null;
    }

    getAvailableRooms() {
        return this.rooms.filter(r => !r.isBooked);
    }

    getRoomsByFloor(floor: number): Room[] {
        return this.rooms.filter(r => r.floor === floor);
    }

    randomize() {
        this.rooms.forEach(r => r.isBooked = Math.random() < 0.3);
        this.message = "Generated random occupancy.";
    }

    reset() {
        this.rooms = this.generateRooms();
        this.message = "System reset.";
        this.requestCount = null;
    }
}