import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  dueDate: string;

  @Column()
  category: string;

  @Column({ default: false })
  completed: boolean;
  @Column()
  userId: number;
  @ManyToOne(()=> User, (user) => user.tasks)
  user : User;
}
