import { Entity } from './Entity';
import { Component } from './Component';
import { System } from './System';

export class World {
  private entities = new Map<number, Entity>();
  private systems: System[] = [];
  private components = new Map<string, Map<number, Component>>();
  private nextEntityId = 1;

  public createEntity(): Entity {
    const entity = new Entity(this.nextEntityId++);
    this.entities.set(entity.id, entity);
    return entity;
  }

  public destroyEntity(entityId: number) {
    // Remove all components for this entity
    for (const [componentType, componentMap] of this.components) {
      componentMap.delete(entityId);
    }
    this.entities.delete(entityId);
  }

  public addSystem(system: System) {
    system.setWorld(this);
    this.systems.push(system);
  }

  public addComponent(entityId: number, component: Component) {
    const componentType = component.constructor.name;
    
    if (!this.components.has(componentType)) {
      this.components.set(componentType, new Map());
    }
    
    this.components.get(componentType)!.set(entityId, component);
  }

  public removeComponent(entityId: number, componentType: string) {
    const componentMap = this.components.get(componentType);
    if (componentMap) {
      componentMap.delete(entityId);
    }
  }

  public getComponent<T extends Component>(entityId: number, componentType: new (...args: any[]) => T): T | undefined {
    const componentMap = this.components.get(componentType.name);
    return componentMap?.get(entityId) as T | undefined;
  }

  public getComponents<T extends Component>(componentType: new (...args: any[]) => T): Map<number, T> {
    const componentMap = this.components.get(componentType.name);
    return (componentMap as Map<number, T>) || new Map();
  }

  public getEntitiesWith(...componentTypes: (new (...args: any[]) => Component)[]): Entity[] {
    const entities: Entity[] = [];
    
    for (const [entityId, entity] of this.entities) {
      const hasAllComponents = componentTypes.every(componentType => 
        this.components.get(componentType.name)?.has(entityId)
      );
      
      if (hasAllComponents) {
        entities.push(entity);
      }
    }
    
    return entities;
  }

  public update(deltaTime: number) {
    for (const system of this.systems) {
      system.update(deltaTime);
    }
  }

  public render(alpha: number) {
    for (const system of this.systems) {
      if ('render' in system && typeof system.render === 'function') {
        (system as any).render(alpha);
      }
    }
  }
}