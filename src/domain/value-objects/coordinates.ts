export class Coordinates {
  private constructor(
    readonly latitude: number,
    readonly longitude: number,
  ) {}

  static create(lat: number, lng: number): Coordinates {
    if (lat < -90 || lat > 90) {
      throw new Error("Latitude must be between -90 and 90");
    }
    if (lng < -180 || lng > 180) {
      throw new Error("Longitude must be between -180 and 180");
    }
    return new Coordinates(lat, lng);
  }

  toString(): string {
    return `${this.latitude.toFixed(6)}, ${this.longitude.toFixed(6)}`;
  }
}
