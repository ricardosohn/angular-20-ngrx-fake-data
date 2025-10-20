import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppSidebarComponent } from './app-sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate', standalone: true })
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('AppSidebarComponent', () => {
  let fixture: ComponentFixture<AppSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSidebarComponent, TranslatePipeStub, RouterTestingModule],
    })
      .overrideComponent(AppSidebarComponent, { set: { imports: [TranslatePipeStub, RouterTestingModule] } })
      .compileComponents();

    fixture = TestBed.createComponent(AppSidebarComponent);
    fixture.detectChanges();
  });

  it('deve renderizar links com labels traduzidas', () => {
    // Arrange
    const el: HTMLElement = fixture.nativeElement;

    // Act
    const links = Array.from(el.querySelectorAll('a'));
    const texts = links.map((a) => a.textContent?.trim());

    // Assert
    expect(texts).toEqual(expect.arrayContaining(['appName', 'products', 'users']));
  });
});
